'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ZonalMapProps {
    zones: any[];
}

export default function ZonalMap({ zones }: ZonalMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
            center: [22.5937, 78.9629],
            zoom: 5,
            zoomControl: false, // We'll disable default to use the ones from UI or none
            attributionControl: false
        });

        // Add dark-themed tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Add zoom control to top-right
        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // Effect to add markers
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;

        // Colors map for Tailwind classes mapping to hex/rgba for styles
        const colorStyles: any = {
            purple: { bg: '#a855f7', shadow: 'rgba(168, 85, 247, 0.4)' },
            pink: { bg: '#ec4899', shadow: 'rgba(236, 72, 153, 0.4)' },
            yellow: { bg: '#eab308', shadow: 'rgba(234, 179, 8, 0.4)' },
            teal: { bg: '#14b8a6', shadow: 'rgba(20, 184, 166, 0.4)' },
            red: { bg: '#ef4444', shadow: 'rgba(239, 68, 68, 0.4)' },
            blue: { bg: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.4)' },
        };

        const markers: L.Marker[] = [];

        zones.forEach(zone => {
            const styles = colorStyles[zone.color] || colorStyles.purple;

            // Build the exact same DOM structure dynamically for marker
            const iconHtml = `
                <div style="position: relative; width: 32px; height: 32px; cursor: pointer;" class="group">
                    <!-- Glowing huge halo background -->
                    <div style="position: absolute; top:0; left:0; right:0; bottom:0; border-radius: 9999px; filter: blur(35px); opacity: 0.7; transform: scale(4); background: ${styles.shadow}; transition: transform 0.5s;"></div>
                    
                    <!-- Pulsing inner dot (simulated with CSS) -->
                    <div style="position: absolute; top:-4px; left:-4px; right:-4px; bottom:-4px; border-radius: 9999px; background-color: ${styles.bg}; opacity: 0.5; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                    
                    <!-- Marker icon -->
                    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 9999px; background-color: ${styles.bg}; border: 2px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                </div>
                <style>
                    @keyframes ping {
                        75%, 100% {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                </style>
            `;

            const customIcon = L.divIcon({
                className: 'custom-leaflet-marker',
                html: iconHtml,
                iconSize: [32, 32],
                iconAnchor: [16, 16] // Center it
            });

            // For now using fallback lat/long for the zones based on names:
            let lat = 22.5937, lng = 78.9629; // default central india
            if (zone.name === 'New Delhi') { lat = 28.6139; lng = 77.2090; }
            if (zone.name === 'Jaipur') { lat = 26.9124; lng = 75.7873; }
            if (zone.name === 'Kanpur') { lat = 26.4499; lng = 80.3319; }
            if (zone.name === 'Kolkata') { lat = 22.5726; lng = 88.3639; }
            if (zone.name === 'Ahmedabad') { lat = 23.0225; lng = 72.5714; }
            if (zone.name === 'Bhopal') { lat = 23.2599; lng = 77.4126; }
            if (zone.name === 'Mumbai') { lat = 19.0760; lng = 72.8777; }
            if (zone.name === 'Pune') { lat = 18.5204; lng = 73.8567; }
            if (zone.name === 'Hyderabad') { lat = 17.3850; lng = 78.4867; }
            if (zone.name === 'Bangalore') { lat = 12.9716; lng = 77.5946; }
            if (zone.name === 'Chennai') { lat = 13.0827; lng = 80.2707; }
            if (zone.name === 'Madurai') { lat = 9.9252; lng = 78.1198; }

            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            markers.push(marker);
        });

        return () => {
            markers.forEach(m => m.remove());
        };
    }, [zones]);

    return (
        <div ref={mapRef} className="absolute inset-0 z-0 bg-[#0a0d13]" style={{ width: '100%', height: '100%' }}>
            <style jsx global>{`
                /* Override Leaflet Background explicitly so dark theme fits perfectly */
                .leaflet-container {
                    background: #0a0d13 !important;
                }
            `}</style>
        </div>
    );
}
