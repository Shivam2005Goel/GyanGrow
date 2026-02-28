import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, X, Users, BookOpen, TrendingUp, Award, Zap, Navigation } from 'lucide-react';
import { GlassCard, Badge, ProgressBar, AnimatedButton } from '../ui';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons based on zone type
const getMarkerIcon = (type, intensity) => {
  const colors = {
    stock_market: '#ef4444',
    fintech: '#3b82f6',
    business: '#8b5cf6',
    industrial: '#f59e0b',
    startup: '#10b981',
    banking: '#eab308',
    trade: '#14b8a6',
    sme: '#ec4899'
  };

  const color = colors[type] || '#6b7280';
  const size = intensity > 0.8 ? 40 : intensity > 0.6 ? 32 : 24;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color}, ${color}aa);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px ${color}66, 0 0 20px ${color}33;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// Heatmap layer using Canvas
const HeatmapOverlay = ({ map, zones }) => {
  const canvasRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');
    canvas.style.position = 'absolute';
    canvas.style.pointerEvents = 'none';
    canvasRef.current = canvas;

    const HeatLayer = L.Layer.extend({
      onAdd: function (map) {
        this._map = map;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        map.getPanes().overlayPane.appendChild(canvas);
        this._reset();
        map.on('viewreset move moveend', this._reset, this);
      },

      onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(canvas);
        map.off('viewreset move moveend', this._reset, this);
      },

      _reset: function () {
        const topLeft = map.containerPointToLayerPoint([0, 0]);
        const size = map.getSize();

        canvas.width = size.x;
        canvas.height = size.y;
        canvas.style.width = size.x + 'px';
        canvas.style.height = size.y + 'px';

        L.DomUtil.setPosition(canvas, topLeft);
        this._draw();
      },

      _draw: function () {
        const ctx = this._ctx;
        const bounds = map.getBounds();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        zones.forEach(zone => {
          const latLng = L.latLng(zone.lat, zone.lng);
          if (!bounds.contains(latLng)) return;

          const point = map.latLngToContainerPoint(latLng);
          const radius = zone.intensity * 100;

          // Create gradient based on intensity
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, radius
          );

          if (zone.intensity > 0.8) {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
            gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.3)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
          } else if (zone.intensity > 0.6) {
            gradient.addColorStop(0, 'rgba(245, 158, 11, 0.5)');
            gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
            gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
            gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });

    layerRef.current = new HeatLayer();
    map.addLayer(layerRef.current);

    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, zones]);

  return null;
};

// Zone Popup Content
const ZonePopup = ({ zone, onSelect }) => (
  <div className="p-2 min-w-[200px]">
    <h3 className="font-bold text-lg mb-1">{zone.name}</h3>
    <p className="text-xs text-gray-600 mb-2">{zone.description}</p>
    <div className="flex items-center gap-2 text-xs mb-2">
      <Users size={14} />
      <span>{zone.learners.toLocaleString()} learners</span>
    </div>
    <div className="flex items-center gap-2 text-xs mb-3">
      <BookOpen size={14} />
      <span>{zone.courses} courses</span>
    </div>
    <button
      onClick={() => onSelect(zone)}
      className="w-full px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600 transition-colors"
    >
      View Details
    </button>
  </div>
);

// Main Leaflet Map Component
const LeafletMap = ({ zones, selectedZone, onSelectZone, showHeatmap, filterType }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  const filteredZones = zones.filter(zone =>
    filterType === 'all' || zone.type === filterType
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on India
    const map = L.map(mapRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: false
    });

    // Add dark-themed tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Add zoom control to top-right
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when zones change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredZones.forEach(zone => {
      const marker = L.marker([zone.lat, zone.lng], {
        icon: getMarkerIcon(zone.type, zone.intensity)
      }).addTo(map);

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-lg mb-1">${zone.name}</h3>
          <p class="text-xs text-gray-600 mb-2">${zone.description}</p>
          <div class="flex items-center gap-2 text-xs mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>${zone.learners.toLocaleString()} learners</span>
          </div>
          <button 
            class="w-full px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600 transition-colors view-details-btn"
            data-zone-id="${zone.id}"
          >
            View Details
          </button>
        </div>
      `;

      popupContent.querySelector('.view-details-btn').addEventListener('click', () => {
        onSelectZone(zone);
      });

      marker.bindPopup(popupContent);

      // Add hover tooltip
      marker.bindTooltip(`
        <div class="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded shadow-lg border border-white/10">
          ${zone.name}
          <div class="font-normal text-[10px] text-gray-400">Click for details</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -20],
        opacity: 1,
        className: 'custom-tooltip' // We'll need to ensure this class doesn't have conflicting styles or use !important
      });

      // Add hover effects
      marker.on('mouseover', function (e) {
        this.openTooltip();
      });
      marker.on('mouseout', function (e) {
        this.closeTooltip();
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (filteredZones.length > 0) {
      const bounds = L.latLngBounds(filteredZones.map(z => [z.lat, z.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredZones, mapReady, onSelectZone]);

  // Fly to selected zone
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedZone) return;

    map.flyTo([selectedZone.lat, selectedZone.lng], 8, {
      duration: 1.5
    });
  }, [selectedZone]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {mapReady && showHeatmap && (
        <HeatmapOverlay map={mapInstanceRef.current} zones={filteredZones} />
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-white/10 z-[400]">
        <h4 className="font-bold mb-3 text-sm">Learning Intensity</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-400" />
            <span className="text-xs text-gray-400">Very High (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400" />
            <span className="text-xs text-gray-400">High (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
            <span className="text-xs text-gray-400">Moderate (40-60%)</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-[400]">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-blue-400" />
            <div>
              <div className="text-lg font-bold">{filteredZones.length}</div>
              <div className="text-xs text-gray-400">Zones</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-green-400" />
            <div>
              <div className="text-lg font-bold">
                {(filteredZones.reduce((acc, z) => acc + z.learners, 0) / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-400">Learners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
