import React, { useState, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, BookOpen, TrendingUp,
  Award, Globe, Zap, Target, Star, Filter, Search,
  Layers, Flame, Navigation, Info, ChevronRight,
  GraduationCap, TrendingUp as TrendIcon, Clock,
  X, Brain, Sparkles, Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton, GlassCard, Badge, SectionTitle, ProgressBar } from '../components/ui';

// Lazy load LeafletMap to reduce initial bundle size
const LeafletMap = lazy(() => import('../components/features/LeafletMap'));

// Zone data with Indian financial districts and learning hubs
// Zone data with Indian financial districts and learning hubs
const zonesData = [
  {
    id: 1,
    name: "Mumbai Financial District",
    lat: 19.0760,
    lng: 72.8777,
    type: "stock_market",
    learners: 15420,
    courses: 45,
    avgProgress: 78,
    intensity: 0.9,
    description: "India's financial capital with focus on stock market trading and investment banking.",
    skills: ["Stock Trading", "Investment Banking", "Portfolio Management", "Risk Analysis"],
    topMentors: 23,
    activeSessions: 156,
    trending: true,
    newCourses: 5
  },
  {
    id: 2,
    name: "Bangalore Tech Hub",
    lat: 12.9716,
    lng: 77.5946,
    type: "fintech",
    learners: 12890,
    courses: 38,
    avgProgress: 82,
    intensity: 0.85,
    description: "Tech-savvy zone focusing on fintech innovations and crypto trading.",
    skills: ["Cryptocurrency", "Blockchain", "Digital Payments", "FinTech Development"],
    topMentors: 31,
    activeSessions: 203,
    trending: true,
    newCourses: 8
  },
  {
    id: 3,
    name: "Delhi NCR Business Zone",
    lat: 28.6139,
    lng: 77.2090,
    type: "business",
    learners: 18650,
    courses: 52,
    avgProgress: 71,
    intensity: 0.95,
    description: "Corporate hub with emphasis on business finance and taxation.",
    skills: ["Tax Planning", "Corporate Finance", "Business Strategy", "GST Compliance"],
    topMentors: 45,
    activeSessions: 289,
    trending: false,
    newCourses: 3
  },
  {
    id: 4,
    name: "Chennai Industrial Zone",
    lat: 13.0827,
    lng: 80.2707,
    type: "industrial",
    learners: 9870,
    courses: 34,
    avgProgress: 68,
    intensity: 0.7,
    description: "Manufacturing and industrial finance learning center.",
    skills: ["Industrial Finance", "Supply Chain Finance", "Export Management", "MSME Funding"],
    topMentors: 18,
    activeSessions: 98,
    trending: false,
    newCourses: 2
  },
  {
    id: 5,
    name: "Hyderabad Startup Valley",
    lat: 17.3850,
    lng: 78.4867,
    type: "startup",
    learners: 11200,
    courses: 41,
    avgProgress: 75,
    intensity: 0.8,
    description: "Emerging startup ecosystem with venture capital focus.",
    skills: ["Venture Capital", "Startup Funding", "Pitch Deck Creation", "Equity Management"],
    topMentors: 27,
    activeSessions: 167,
    trending: true,
    newCourses: 6
  },
  {
    id: 6,
    name: "Pune Banking Hub",
    lat: 18.5204,
    lng: 73.8567,
    type: "banking",
    learners: 13560,
    courses: 39,
    avgProgress: 79,
    intensity: 0.75,
    description: "Traditional banking and insurance learning zone.",
    skills: ["Retail Banking", "Insurance Planning", "Loan Management", "Credit Analysis"],
    topMentors: 29,
    activeSessions: 145,
    trending: false,
    newCourses: 4
  },
  {
    id: 7,
    name: "Kolkata Trade Center",
    lat: 22.5726,
    lng: 88.3639,
    type: "trade",
    learners: 7650,
    courses: 28,
    avgProgress: 65,
    intensity: 0.6,
    description: "Eastern India's trading and commodity finance hub.",
    skills: ["Commodity Trading", "Forex Management", "International Trade", "Import/Export Finance"],
    topMentors: 15,
    activeSessions: 76,
    trending: false,
    newCourses: 1
  },
  {
    id: 8,
    name: "Ahmedabad SME Cluster",
    lat: 23.0225,
    lng: 72.5714,
    type: "sme",
    learners: 8920,
    courses: 31,
    avgProgress: 72,
    intensity: 0.65,
    description: "Small and medium enterprise finance specialization.",
    skills: ["SME Financing", "Working Capital", "Business Loans", "Financial Planning"],
    topMentors: 19,
    activeSessions: 89,
    trending: false,
    newCourses: 2
  },
  {
    id: 9,
    name: "Jaipur Heritage Finance",
    lat: 26.9124,
    lng: 75.7873,
    type: "sme",
    learners: 5400,
    courses: 22,
    avgProgress: 60,
    intensity: 0.55,
    description: "Hub for heritage business and tourism finance.",
    skills: ["Tourism Finance", "Heritage Business", "Artisan Loans", "Microfinance"],
    topMentors: 12,
    activeSessions: 45,
    trending: false,
    newCourses: 1
  },
  {
    id: 10,
    name: "Kochi Maritime Hub",
    lat: 9.9312,
    lng: 76.2673,
    type: "trade",
    learners: 4800,
    courses: 18,
    avgProgress: 58,
    intensity: 0.5,
    description: "Focus on maritime trade and shipping finance.",
    skills: ["Shipping Finance", "Maritime Law", "Logistics Funding", "Port Operations"],
    topMentors: 8,
    activeSessions: 34,
    trending: false,
    newCourses: 2
  },
  {
    id: 11,
    name: "Indore Trading Zone",
    lat: 22.7196,
    lng: 75.8577,
    type: "stock_market",
    learners: 9200,
    courses: 35,
    avgProgress: 70,
    intensity: 0.72,
    description: "Central India's trading capital with active diverse markets.",
    skills: ["Commodities", "Equity Analysis", "Technical Analysis", "Day Trading"],
    topMentors: 21,
    activeSessions: 112,
    trending: true,
    newCourses: 4
  },
  {
    id: 12,
    name: "Lucknow Administrative Hub",
    lat: 26.8467,
    lng: 80.9462,
    type: "banking",
    learners: 8500,
    courses: 30,
    avgProgress: 66,
    intensity: 0.62,
    description: "Learning center for public sector banking and administration.",
    skills: ["Public Finance", "Government Schemes", "Rural Banking", "Policy Making"],
    topMentors: 17,
    activeSessions: 85,
    trending: false,
    newCourses: 2
  }
];

// Zone colors mapping
const zoneColors = {
  stock_market: 'from-red-500 to-pink-500',
  fintech: 'from-blue-500 to-cyan-500',
  business: 'from-purple-500 to-indigo-500',
  industrial: 'from-orange-500 to-amber-500',
  startup: 'from-green-500 to-emerald-500',
  banking: 'from-yellow-500 to-orange-500',
  trade: 'from-teal-500 to-cyan-500',
  sme: 'from-pink-500 to-rose-500'
};

// Zone Detail Panel Component
const ZoneDetailPanel = ({ zone, onClose, onJoin }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!zone) return null;
  const colorClass = zoneColors[zone.type] || 'from-gray-500 to-slate-500';

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-gray-950/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
    >
      {/* Header Image */}
      <div className={`h-48 bg-gradient-to-br ${colorClass} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge color={zone.intensity > 0.8 ? 'red' : zone.intensity > 0.6 ? 'yellow' : 'green'}>
              {zone.type.replace('_', ' ').toUpperCase()}
            </Badge>
            {zone.trending && (
              <Badge color="purple" className="flex items-center gap-1">
                <TrendIcon size={12} />
                Trending
              </Badge>
            )}
          </div>
          <h2 className="text-3xl font-bold text-white">{zone.name}</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
          {['overview', 'mentors', 'courses'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Description */}
            <p className="text-gray-300 leading-relaxed">{zone.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <GlassCard className="text-center p-4">
                <Users size={24} className="mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{zone.learners.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Active Learners</div>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <BookOpen size={24} className="mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">{zone.courses}</div>
                <div className="text-xs text-gray-400">Courses</div>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <Award size={24} className="mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">{zone.topMentors}</div>
                <div className="text-xs text-gray-400">Expert Mentors</div>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <Zap size={24} className="mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{zone.activeSessions}</div>
                <div className="text-xs text-gray-400">Live Sessions</div>
              </GlassCard>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Zone Average Progress</span>
                <span className="text-sm font-bold">{zone.avgProgress}%</span>
              </div>
              <ProgressBar
                progress={zone.avgProgress}
                color={zone.avgProgress > 75 ? 'green' : zone.avgProgress > 60 ? 'yellow' : 'purple'}
              />
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Brain size={18} className="text-purple-400" />
                Skills Offered
              </h3>
              <div className="flex flex-wrap gap-2">
                {zone.skills.map((skill, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/10 hover:bg-purple-500/30 rounded-full text-sm border border-white/20 hover:border-purple-500/50 transition-all"
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>
            </div>

            <AnimatedButton variant="primary" className="w-full" onClick={onJoin}>
              <GraduationCap size={18} />
              Join Zone Learning
            </AnimatedButton>
          </motion.div>
        )}

        {activeTab === 'mentors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Users size={18} className="text-blue-400" />
              Top Mentors from {zone.name}
            </h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold">
                  M{i}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">FinTech Expert {i}</div>
                  <div className="text-xs text-gray-400">Senior Analyst • 8+ Years Exp.</div>
                </div>
                <AnimatedButton variant="outline" className="text-xs px-3 py-1 h-8">
                  Connect
                </AnimatedButton>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'courses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-purple-400" />
              Popular Courses
            </h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <Badge color="purple" className="text-[10px]">Intermediate</Badge>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <Star size={12} fill="currentColor" />
                    4.{8 - i}
                  </div>
                </div>
                <h4 className="font-bold mb-1">Advanced Financial Strategies {i}</h4>
                <p className="text-xs text-gray-400 mb-3">Master the art of wealth creation with this comprehensive guide.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">24 Lessons • 5h 30m</span>
                  <button className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

// Zone List View Component
const ZoneListView = ({ zones, selectedZone, onSelect }) => {
  return (
    <div className="space-y-3 p-4">
      {zones.map((zone, index) => {
        const colorClass = zoneColors[zone.type] || 'from-gray-500 to-slate-500';
        const isSelected = selectedZone?.id === zone.id;

        return (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(zone)}
            className={`p-4 rounded-xl cursor-pointer transition-all ${isSelected
                ? 'bg-purple-500/20 border border-purple-500/50'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold truncate">{zone.name}</h3>
                  {zone.trending && (
                    <TrendIcon size={14} className="text-purple-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1 mb-2">{zone.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {(zone.learners / 1000).toFixed(1)}K
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} />
                    {zone.courses}
                  </span>
                  <span className={`flex items-center gap-1 ${zone.intensity > 0.8 ? 'text-red-400' :
                      zone.intensity > 0.6 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                    <Flame size={12} />
                    {(zone.intensity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Main Component
const ZonalLearningPage = () => {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [showOnboarding, setShowOnboarding] = useState(true);

  const filteredZones = useMemo(() => {
    return zonesData.filter(zone => {
      const matchesType = filterType === 'all' || zone.type === filterType;
      const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [filterType, searchQuery]);

  const stats = useMemo(() => ({
    totalZones: filteredZones.length,
    totalLearners: filteredZones.reduce((acc, z) => acc + z.learners, 0),
    totalCourses: filteredZones.reduce((acc, z) => acc + z.courses, 0),
    avgProgress: Math.round(filteredZones.reduce((acc, z) => acc + z.avgProgress, 0) / (filteredZones.length || 1))
  }), [filteredZones]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </motion.button>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Globe className="text-purple-400" size={24} />
              <span className="hidden sm:inline">Zonal Learning</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Toggle */}
            <div className="hidden sm:flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'map' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Map size={16} className="inline mr-1" />
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Layers size={16} className="inline mr-1" />
                List
              </button>
            </div>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search zones..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm focus:outline-none focus:border-purple-500 transition-colors w-48 lg:w-64"
              />
            </div>

            {/* Heatmap Toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`p-2 rounded-lg transition-colors ${showHeatmap ? 'bg-purple-500/30 text-purple-400' : 'bg-white/10 text-gray-400'}`}
              title="Toggle Heatmap"
            >
              <Flame size={20} />
            </button>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Zones</option>
              <option value="stock_market">Stock Market</option>
              <option value="fintech">FinTech</option>
              <option value="business">Business</option>
              <option value="startup">Startup</option>
              <option value="banking">Banking</option>
              <option value="industrial">Industrial</option>
              <option value="trade">Trade</option>
              <option value="sme">SME</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 h-screen flex flex-col lg:flex-row">
        {/* Sidebar Stats */}
        <div className="lg:w-80 bg-gray-900/50 border-r border-white/10 overflow-y-auto">
          <div className="p-4 space-y-4">
            <SectionTitle title="Zone Overview" subtitle="Learning across India" />

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <GlassCard className="text-center p-4">
                <Navigation size={24} className="mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{stats.totalZones}</div>
                <div className="text-xs text-gray-400">Active Zones</div>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <Users size={24} className="mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{(stats.totalLearners / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-400">Total Learners</div>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <BookOpen size={24} className="mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <div className="text-xs text-gray-400">Available Courses</div>
              </GlassCard>
              <GlassCard className="text-center p-4">
                <Target size={24} className="mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">{stats.avgProgress}%</div>
                <div className="text-xs text-gray-400">Avg Progress</div>
              </GlassCard>
            </div>

            {/* Zone List (visible on mobile list view) */}
            {viewMode === 'list' && (
              <ZoneListView
                zones={filteredZones}
                selectedZone={selectedZone}
                onSelect={setSelectedZone}
              />
            )}
          </div>
        </div>

        {/* Map Area */}
        {viewMode === 'map' && (
          <div className="flex-1 relative bg-gray-950">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading Map...</p>
                </div>
              </div>
            }>
              <LeafletMap
                zones={zonesData}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                showHeatmap={showHeatmap}
                filterType={filterType}
              />
            </Suspense>
          </div>
        )}
      </div>

      {/* Zone Detail Panel */}
      <AnimatePresence>
        {selectedZone && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSelectedZone(null)}
            />
            <ZoneDetailPanel
              zone={selectedZone}
              onClose={() => setSelectedZone(null)}
              onJoin={() => navigate('/learning')}
            />
          </>
        )}
      </AnimatePresence>

      {/* Onboarding Tooltip */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 max-w-md w-full mx-4"
          >
            <GlassCard className="p-4 flex items-start gap-3">
              <Info size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold mb-1">Welcome to Zonal Learning!</h4>
                <p className="text-sm text-gray-400">
                  Explore learning zones across India. Click on markers to view zone details,
                  or toggle the heatmap to see learning intensity.
                </p>
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X size={16} />
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZonalLearningPage;
