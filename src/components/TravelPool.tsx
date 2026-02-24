'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car, Train, MapPin, Clock, Users, Plus, X, Search,
    ArrowRight, Calendar, Star, Shield, MessageCircle,
    Zap, Filter, Navigation, Plane, Bus, ChevronDown,
    UserPlus, Phone, CheckCircle, AlertCircle, Route
} from 'lucide-react';

type TripType = 'offer' | 'request';
type TransportMode = 'car' | 'bus' | 'train' | 'flight' | 'auto';

interface TravelPost {
    id: string;
    author: string;
    avatar: string;
    year: string;
    major: string;
    type: TripType;
    mode: TransportMode;
    from: string;
    to: string;
    date: string;
    time: string;
    seats: number;
    seatsLeft: number;
    price: number;
    note: string;
    verified: boolean;
    rating: number;
    riders: string[];
    tags: string[];
}

const transportModes: Record<TransportMode, { icon: any; label: string; color: string; gradient: string }> = {
    car: { icon: Car, label: 'Car', color: 'cyan', gradient: 'from-cyan-500 to-blue-600' },
    bus: { icon: Bus, label: 'Bus', color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
    train: { icon: Train, label: 'Train', color: 'violet', gradient: 'from-violet-500 to-purple-600' },
    flight: { icon: Plane, label: 'Flight', color: 'amber', gradient: 'from-amber-500 to-orange-600' },
    auto: { icon: Navigation, label: 'Auto', color: 'rose', gradient: 'from-rose-500 to-pink-600' },
};

const popularRoutes = [
    { from: 'VIT Campus', to: 'Chennai Airport', emoji: '✈️' },
    { from: 'VIT Campus', to: 'Vellore Railway Station', emoji: '🚂' },
    { from: 'VIT Campus', to: 'Katpadi Junction', emoji: '🚉' },
    { from: 'VIT Campus', to: 'Chennai Central', emoji: '🏙️' },
    { from: 'VIT Campus', to: 'Bangalore', emoji: '🌆' },
];

// Mock travel data
const mockPosts: TravelPost[] = [
    {
        id: '1', author: 'Rahul S.', avatar: 'RS', year: '3rd Year', major: 'CSE',
        type: 'offer', mode: 'car', from: 'VIT Campus', to: 'Chennai Airport',
        date: '2026-02-25', time: '06:00 AM', seats: 4, seatsLeft: 2, price: 350,
        note: 'Leaving early for a morning flight. AC car, comfortable ride.',
        verified: true, rating: 4.8, riders: ['AK', 'PS'],
        tags: ['Early Morning', 'AC', 'Music OK']
    },
    {
        id: '2', author: 'Priya M.', avatar: 'PM', year: '2nd Year', major: 'IT',
        type: 'request', mode: 'train', from: 'VIT Campus', to: 'Katpadi Junction',
        date: '2026-02-25', time: '10:30 AM', seats: 1, seatsLeft: 1, price: 0,
        note: 'Need a ride to Katpadi to catch the 11:15 train to Bangalore.',
        verified: true, rating: 4.5, riders: [],
        tags: ['Urgent', 'One-way']
    },
    {
        id: '3', author: 'Arjun K.', avatar: 'AK', year: '4th Year', major: 'ECE',
        type: 'offer', mode: 'car', from: 'VIT Campus', to: 'Bangalore',
        date: '2026-02-26', time: '08:00 AM', seats: 3, seatsLeft: 3, price: 600,
        note: 'Weekend trip to Bangalore. Looking for co-travelers to split fuel.',
        verified: true, rating: 4.9, riders: [],
        tags: ['Weekend', 'Long Trip', 'Fuel Split']
    },
    {
        id: '4', author: 'Sneha R.', avatar: 'SR', year: '3rd Year', major: 'CSE',
        type: 'offer', mode: 'auto', from: 'VIT Campus', to: 'Vellore Fort',
        date: '2026-02-25', time: '04:00 PM', seats: 3, seatsLeft: 2, price: 80,
        note: 'Going to Vellore Fort for photography. Join if you want!',
        verified: false, rating: 4.2, riders: ['DI'],
        tags: ['Sightseeing', 'Fun']
    },
    {
        id: '5', author: 'Vikram J.', avatar: 'VJ', year: '4th Year', major: 'MECH',
        type: 'offer', mode: 'bus', from: 'Chennai Central', to: 'VIT Campus',
        date: '2026-02-27', time: '02:00 PM', seats: 2, seatsLeft: 2, price: 200,
        note: 'Reserved bus tickets. Extra seat available at same price.',
        verified: true, rating: 4.7, riders: [],
        tags: ['Return', 'Reserved']
    },
    {
        id: '6', author: 'Divya I.', avatar: 'DI', year: '3rd Year', major: 'CSE',
        type: 'request', mode: 'car', from: 'VIT Campus', to: 'Chennai Airport',
        date: '2026-02-28', time: '04:00 AM', seats: 1, seatsLeft: 1, price: 0,
        note: 'Need early morning ride to airport. Can share costs. Have a 7 AM flight.',
        verified: true, rating: 4.6, riders: [],
        tags: ['Early Morning', 'Urgent', 'Cost Share']
    },
    {
        id: '7', author: 'Karthik N.', avatar: 'KN', year: '2nd Year', major: 'IT',
        type: 'offer', mode: 'car', from: 'VIT Campus', to: 'Pondicherry',
        date: '2026-03-01', time: '07:00 AM', seats: 4, seatsLeft: 4, price: 500,
        note: 'Weekend getaway to Pondy! Fun group. Girls and guys welcome.',
        verified: true, rating: 4.4, riders: [],
        tags: ['Weekend Trip', 'Fun', 'Beach']
    },
];

export default function TravelPool() {
    const [posts, setPosts] = useState<TravelPost[]>(mockPosts);
    const [activeFilter, setActiveFilter] = useState<'all' | 'offer' | 'request'>('all');
    const [modeFilter, setModeFilter] = useState<TransportMode | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPost, setSelectedPost] = useState<TravelPost | null>(null);
    const [joinedPosts, setJoinedPosts] = useState<Set<string>>(new Set());
    const [newPost, setNewPost] = useState({
        type: 'offer' as TripType,
        mode: 'car' as TransportMode,
        from: 'VIT Campus',
        to: '',
        date: '',
        time: '',
        seats: 4,
        price: 0,
        note: '',
    });

    const filteredPosts = posts.filter(p => {
        if (activeFilter !== 'all' && p.type !== activeFilter) return false;
        if (modeFilter !== 'all' && p.mode !== modeFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return p.from.toLowerCase().includes(q) || p.to.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
        }
        return true;
    });

    const handleCreate = () => {
        const post: TravelPost = {
            id: `post-${Date.now()}`,
            author: 'You',
            avatar: 'AU',
            year: '3rd Year',
            major: 'CSE',
            type: newPost.type,
            mode: newPost.mode,
            from: newPost.from,
            to: newPost.to,
            date: newPost.date,
            time: newPost.time,
            seats: newPost.seats,
            seatsLeft: newPost.seats,
            price: newPost.price,
            note: newPost.note,
            verified: true,
            rating: 5.0,
            riders: [],
            tags: [],
        };
        setPosts(prev => [post, ...prev]);
        setShowCreate(false);
        setNewPost({ type: 'offer', mode: 'car', from: 'VIT Campus', to: '', date: '', time: '', seats: 4, price: 0, note: '' });
    };

    const handleJoin = (postId: string) => {
        setJoinedPosts(prev => new Set(prev).add(postId));
        setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, seatsLeft: Math.max(0, p.seatsLeft - 1), riders: [...p.riders, 'AU'] } : p
        ));
    };

    const formatDate = (d: string) => {
        const date = new Date(d);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const offerCount = posts.filter(p => p.type === 'offer').length;
    const requestCount = posts.filter(p => p.type === 'request').length;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden gap-3">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: -5 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                    >
                        <Car size={22} className="text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Travel Pool</h2>
                        <p className="text-white/40 text-xs">{offerCount} rides · {requestCount} requests</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-xl transition-all border ${showFilters
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-white/[0.05] border-white/[0.06] text-white/50 hover:text-white'
                            }`}
                    >
                        <Filter size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreate(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-600 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                    >
                        <Plus size={14} /> Post Ride
                    </motion.button>
                </div>
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search routes, destinations..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-white/25 outline-none focus:border-cyan-500/30 transition-colors"
                />
            </div>

            {/* Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-shrink-0 overflow-hidden"
                    >
                        <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05] space-y-2">
                            <div className="flex gap-1.5">
                                {(['all', 'car', 'bus', 'train', 'auto', 'flight'] as const).map(m => {
                                    const modeInfo = m === 'all' ? null : transportModes[m];
                                    return (
                                        <button
                                            key={m}
                                            onClick={() => setModeFilter(m)}
                                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 ${modeFilter === m
                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                : 'bg-white/[0.03] text-white/40 border border-transparent hover:text-white/60'
                                                }`}
                                        >
                                            {modeInfo ? <modeInfo.icon size={11} /> : <Route size={11} />}
                                            {m === 'all' ? 'All' : modeInfo?.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Type Toggle */}
            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-xl w-fit flex-shrink-0 border border-white/[0.05]">
                {[
                    { id: 'all' as const, label: 'All Rides', count: posts.length },
                    { id: 'offer' as const, label: 'Offering', count: offerCount },
                    { id: 'request' as const, label: 'Requesting', count: requestCount },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id)}
                        className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${activeFilter === tab.id ? 'text-white' : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        {activeFilter === tab.id && (
                            <motion.div
                                layoutId="travelTab"
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-lg border border-cyan-500/20"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                        <span className="relative z-10 text-[9px] text-white/30">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Popular Routes */}
            <div className="flex gap-2 flex-shrink-0 overflow-x-auto pb-1">
                {popularRoutes.map((route, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSearchQuery(route.to)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] rounded-lg border border-white/[0.04] text-white/50 text-[10px] whitespace-nowrap hover:bg-white/[0.04] transition-colors"
                    >
                        <span>{route.emoji}</span>
                        <span>{route.to.replace('VIT Campus → ', '')}</span>
                    </motion.button>
                ))}
            </div>

            {/* Posts List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <Car size={40} className="text-white/10 mx-auto mb-3" />
                        <p className="text-white/40 text-sm font-medium">No rides found</p>
                        <p className="text-white/20 text-xs mt-1">Try a different filter or post your own ride!</p>
                    </div>
                ) : (
                    filteredPosts.map((post, i) => {
                        const modeInfo = transportModes[post.mode];
                        const ModeIcon = modeInfo.icon;
                        const isJoined = joinedPosts.has(post.id);

                        return (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => setSelectedPost(post)}
                                className="bg-[#0c0e18] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-white/[0.1] transition-all cursor-pointer group"
                            >
                                <div className="p-4">
                                    {/* Top Row */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${modeInfo.gradient} flex items-center justify-center text-white font-bold text-xs`}>
                                                {post.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-white font-semibold text-sm">{post.author}</span>
                                                    {post.verified && <Shield size={11} className="text-cyan-400" />}
                                                    <span className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                                                        <Star size={9} fill="currentColor" /> {post.rating}
                                                    </span>
                                                </div>
                                                <p className="text-white/30 text-[10px]">{post.major} · {post.year}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold ${post.type === 'offer'
                                                ? 'bg-emerald-500/15 text-emerald-400'
                                                : 'bg-amber-500/15 text-amber-400'
                                                }`}>
                                                {post.type === 'offer' ? '🚗 Offering' : '🙋 Requesting'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Route */}
                                    <div className="flex items-center gap-2 mb-3 pl-1">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                            <div className="w-px h-6 bg-gradient-to-b from-cyan-400/50 to-emerald-400/50" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <p className="text-white/80 text-sm font-medium">{post.from}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/80 text-sm font-medium">{post.to}</p>
                                            </div>
                                        </div>
                                        <ModeIcon size={18} className={`text-${modeInfo.color}-400 opacity-40 group-hover:opacity-70 transition-opacity`} />
                                    </div>

                                    {/* Details Row */}
                                    <div className="flex items-center gap-3 text-[10px] text-white/40 mb-2">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} /> {formatDate(post.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} /> {post.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={10} /> {post.seatsLeft}/{post.seats} seats
                                        </span>
                                        {post.price > 0 && (
                                            <span className="text-emerald-400 font-semibold">₹{post.price}/person</span>
                                        )}
                                        {post.price === 0 && (
                                            <span className="text-cyan-400 font-semibold">Free</span>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {post.tags.length > 0 && (
                                        <div className="flex gap-1 flex-wrap">
                                            {post.tags.map((tag, j) => (
                                                <span key={j} className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded text-[9px] text-white/35">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Note */}
                                    {post.note && (
                                        <p className="text-white/30 text-xs mt-2 line-clamp-1 italic">"{post.note}"</p>
                                    )}

                                    {/* Action */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                                        <div className="flex -space-x-1.5">
                                            {post.riders.map((r, j) => (
                                                <div key={j} className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[8px] text-white/50 font-medium">
                                                    {r}
                                                </div>
                                            ))}
                                            {post.riders.length === 0 && <span className="text-white/20 text-[10px]">No riders yet</span>}
                                        </div>
                                        {post.type === 'offer' && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => { e.stopPropagation(); handleJoin(post.id); }}
                                                disabled={isJoined || post.seatsLeft === 0}
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${isJoined
                                                    ? 'bg-emerald-500/15 text-emerald-400 cursor-default'
                                                    : post.seatsLeft === 0
                                                        ? 'bg-white/[0.03] text-white/20 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40'
                                                    }`}
                                            >
                                                {isJoined ? <><CheckCircle size={11} /> Joined</> : post.seatsLeft === 0 ? 'Full' : <><UserPlus size={11} /> Join Ride</>}
                                            </motion.button>
                                        )}
                                        {post.type === 'request' && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center gap-1"
                                            >
                                                <MessageCircle size={11} /> Offer Help
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Create Ride Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreate(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="bg-[#0a0a14]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
                        >
                            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center">
                                        <Plus size={14} className="text-white" />
                                    </div>
                                    Post a Ride
                                </h3>
                                <button onClick={() => setShowCreate(false)} className="p-1.5 hover:bg-white/[0.05] rounded-lg">
                                    <X size={16} className="text-white/40" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Type */}
                                <div>
                                    <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">I want to</label>
                                    <div className="flex gap-2">
                                        {(['offer', 'request'] as const).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setNewPost(p => ({ ...p, type: t }))}
                                                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${newPost.type === t
                                                    ? t === 'offer'
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                    : 'bg-white/[0.03] text-white/40 border border-transparent'
                                                    }`}
                                            >
                                                {t === 'offer' ? '🚗 Offer a Ride' : '🙋 Request a Ride'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Transport Mode */}
                                <div>
                                    <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">Transport</label>
                                    <div className="flex gap-1.5">
                                        {(Object.keys(transportModes) as TransportMode[]).map(m => {
                                            const info = transportModes[m];
                                            const Icon = info.icon;
                                            return (
                                                <button
                                                    key={m}
                                                    onClick={() => setNewPost(p => ({ ...p, mode: m }))}
                                                    className={`flex-1 py-2 rounded-xl text-[10px] font-medium transition-all flex flex-col items-center gap-1 ${newPost.mode === m
                                                        ? `bg-${info.color}-500/20 text-${info.color}-400 border border-${info.color}-500/30`
                                                        : 'bg-white/[0.03] text-white/40 border border-transparent'
                                                        }`}
                                                >
                                                    <Icon size={14} />
                                                    {info.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Route */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">From</label>
                                        <input
                                            type="text"
                                            value={newPost.from}
                                            onChange={e => setNewPost(p => ({ ...p, from: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm outline-none focus:border-cyan-500/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">To</label>
                                        <input
                                            type="text"
                                            value={newPost.to}
                                            onChange={e => setNewPost(p => ({ ...p, to: e.target.value }))}
                                            placeholder="Destination"
                                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-500/30"
                                        />
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">Date</label>
                                        <input
                                            type="date"
                                            value={newPost.date}
                                            onChange={e => setNewPost(p => ({ ...p, date: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm outline-none focus:border-cyan-500/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">Time</label>
                                        <input
                                            type="text"
                                            value={newPost.time}
                                            onChange={e => setNewPost(p => ({ ...p, time: e.target.value }))}
                                            placeholder="e.g. 08:00 AM"
                                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-500/30"
                                        />
                                    </div>
                                </div>

                                {/* Seats & Price */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">Seats</label>
                                        <input
                                            type="number"
                                            value={newPost.seats}
                                            onChange={e => setNewPost(p => ({ ...p, seats: parseInt(e.target.value) || 1 }))}
                                            min={1}
                                            max={10}
                                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm outline-none focus:border-cyan-500/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">Price/Person (₹)</label>
                                        <input
                                            type="number"
                                            value={newPost.price}
                                            onChange={e => setNewPost(p => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                                            min={0}
                                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm outline-none focus:border-cyan-500/30"
                                        />
                                    </div>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5 block">Note</label>
                                    <textarea
                                        value={newPost.note}
                                        onChange={e => setNewPost(p => ({ ...p, note: e.target.value }))}
                                        placeholder="Any details about the ride..."
                                        rows={2}
                                        className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm placeholder:text-white/20 outline-none focus:border-cyan-500/30 resize-none"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreate}
                                    disabled={!newPost.to || !newPost.date || !newPost.time}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Car size={16} /> Post Ride
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post Detail Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="bg-[#0a0a14]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full max-w-md overflow-hidden"
                        >
                            {(() => {
                                const mInfo = transportModes[selectedPost.mode];
                                const MIcon = mInfo.icon;
                                const isJ = joinedPosts.has(selectedPost.id);
                                return (
                                    <>
                                        {/* Header bar */}
                                        <div className={`p-4 bg-gradient-to-r ${mInfo.gradient} bg-opacity-10`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <MIcon size={18} className="text-white/80" />
                                                    <span className="text-white font-semibold text-sm">{mInfo.label} Ride</span>
                                                </div>
                                                <button onClick={() => setSelectedPost(null)} className="p-1.5 hover:bg-white/10 rounded-lg">
                                                    <X size={16} className="text-white/60" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
                                                    <div className="w-px h-8 bg-white/40" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-white/80 ring-2 ring-white/20" />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <p className="text-white font-bold">{selectedPost.from}</p>
                                                    <p className="text-white font-bold">{selectedPost.to}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-4">
                                            {/* Driver */}
                                            <div className="flex items-center gap-3">
                                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mInfo.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                                                    {selectedPost.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-white font-semibold text-sm">{selectedPost.author}</span>
                                                        {selectedPost.verified && <Shield size={12} className="text-cyan-400" />}
                                                    </div>
                                                    <p className="text-white/40 text-xs">{selectedPost.major} · {selectedPost.year}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    <Star size={12} fill="currentColor" />
                                                    <span className="text-sm font-bold">{selectedPost.rating}</span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-2.5 bg-white/[0.03] rounded-xl">
                                                    <p className="text-white/30 text-[9px] uppercase">Date</p>
                                                    <p className="text-white text-sm font-medium">{formatDate(selectedPost.date)}</p>
                                                </div>
                                                <div className="p-2.5 bg-white/[0.03] rounded-xl">
                                                    <p className="text-white/30 text-[9px] uppercase">Time</p>
                                                    <p className="text-white text-sm font-medium">{selectedPost.time}</p>
                                                </div>
                                                <div className="p-2.5 bg-white/[0.03] rounded-xl">
                                                    <p className="text-white/30 text-[9px] uppercase">Seats Left</p>
                                                    <p className="text-white text-sm font-medium">{selectedPost.seatsLeft} / {selectedPost.seats}</p>
                                                </div>
                                                <div className="p-2.5 bg-white/[0.03] rounded-xl">
                                                    <p className="text-white/30 text-[9px] uppercase">Price</p>
                                                    <p className="text-emerald-400 text-sm font-bold">{selectedPost.price > 0 ? `₹${selectedPost.price}` : 'Free'}</p>
                                                </div>
                                            </div>

                                            {/* Note */}
                                            {selectedPost.note && (
                                                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                                                    <p className="text-white/60 text-xs leading-relaxed">{selectedPost.note}</p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {selectedPost.type === 'offer' ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => { handleJoin(selectedPost.id); setSelectedPost(null); }}
                                                        disabled={isJ || selectedPost.seatsLeft === 0}
                                                        className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${isJ
                                                            ? 'bg-emerald-500/15 text-emerald-400'
                                                            : 'bg-gradient-to-r from-cyan-500 to-emerald-600 text-white shadow-lg shadow-cyan-500/20'
                                                            } disabled:opacity-30`}
                                                    >
                                                        {isJ ? <><CheckCircle size={16} /> Joined!</> : <><UserPlus size={16} /> Join This Ride</>}
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        <MessageCircle size={16} /> Contact
                                                    </motion.button>
                                                )}
                                                <button className="p-3 bg-white/[0.05] rounded-xl hover:bg-white/[0.08] text-white/50">
                                                    <Phone size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
