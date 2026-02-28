'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ShoppingCart, Heart, Grid, List, ChevronDown,
    BookOpen, Zap, Package, Award, HeartPulse, X,
    Star
} from 'lucide-react';

const CATEGORIES = [
    { id: 'all', name: 'All', icon: Zap },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'skills', name: 'Skills', icon: Zap },
    { id: 'goods', name: 'Goods', icon: Package },
    { id: 'services', name: 'Services', icon: Award },
    { id: 'wellness', name: 'Wellness', icon: HeartPulse },
];

const LISTINGS = [
    {
        id: 1,
        title: 'Advanced Web Development Bootcamp',
        vendor: 'TechGuru Academy',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
        discount: '-50%',
        badges: ['Bestseller', 'Trending'],
        rating: 4.8,
        reviews: 1240,
        price: 4999,
        originalPrice: 9999,
        category: 'courses',
        videoId: 'NuXRUREv440'
    },
    {
        id: 2,
        title: 'Handcrafted Kashmiri Pashmina Shawl',
        vendor: 'Kashmir Heritage',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=600',
        discount: '-44%',
        badges: ['Authentic', 'Handmade'],
        rating: 4.9,
        reviews: 856,
        price: 2499,
        originalPrice: 4500,
        category: 'goods',
        videoId: 'w-yZlFfW86w'
    },
    {
        id: 3,
        title: 'Indian Cuisine Masterclass',
        vendor: 'Chef Vikas Khanna',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600',
        discount: '-50%',
        badges: ["Chef's Special"],
        rating: 4.7,
        reviews: 2100,
        price: 3999,
        originalPrice: 7999,
        category: 'courses',
        videoId: 'S408Qe9d40w'
    },
    {
        id: 4,
        title: 'AI-Powered Business Automation',
        vendor: 'AI Solutions Pro',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
        discount: '-40%',
        badges: ['Premium'],
        rating: 4.6,
        reviews: 320,
        price: 14999,
        originalPrice: 25000,
        category: 'services',
        videoId: '2ePbxJ0pYfU'
    },
    {
        id: 5,
        title: 'Vintage Bollywood Poster Collection',
        vendor: 'Retro Arts',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600',
        discount: '-47%',
        badges: ['Rare'],
        rating: 4.5,
        reviews: 156,
        price: 1599,
        originalPrice: 2999,
        category: 'goods',
        videoId: '0mHms9YrtZc'
    },
    {
        id: 6,
        title: 'Mindfulness & Meditation Retreat',
        vendor: 'Zen Wellness',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
        discount: '-44%',
        badges: ['Wellness'],
        rating: 4.9,
        reviews: 512,
        price: 8999,
        originalPrice: 15999,
        category: 'wellness',
        videoId: 'inpok4MKVLM'
    },
    {
        id: 7,
        title: 'Blockchain Architecture Setup',
        vendor: 'Crypto Systems',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=600',
        discount: '-50%',
        badges: ['Technical'],
        rating: 4.8,
        reviews: 89,
        price: 29999,
        originalPrice: 59999,
        category: 'services',
        videoId: 'f9nATd6kZ-4'
    },
    {
        id: 8,
        title: 'Hand-painted Blue Pottery',
        vendor: 'Jaipur Crafters',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600',
        discount: '-43%',
        badges: ['Artisan'],
        rating: 4.7,
        reviews: 420,
        price: 1299,
        originalPrice: 2299,
        category: 'goods',
        videoId: 'E9rB2sO_m94'
    }
];

const DhanGyanMarketplace = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState(30000);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const filteredListings = LISTINGS.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesPrice = item.price <= priceRange;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
    });

    return (
        <div className="flex flex-col h-screen w-full bg-[#0a0a0f] text-white font-sans overflow-hidden">
            {/* Top Navigation */}
            <header className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0e0e12] shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate?.('dhangyan')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <ShoppingCart size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-[17px] font-bold tracking-wide">AI Marketplace</h1>
                            <p className="text-[11px] text-gray-400">Discover amazing products & services</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl px-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses, products, services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-[#141419] border border-white/5 rounded-full focus:outline-none focus:border-pink-500/50 transition-colors text-[14px]"
                        />
                    </div>
                </div>

                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                    <ShoppingCart size={18} className="text-gray-300" />
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-[280px] border-r border-white/5 bg-[#0a0a0f] flex flex-col overflow-y-auto shrink-0 p-5">
                    <div className="mb-8">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Categories</h3>
                        <div className="space-y-1">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[14px] ${activeCategory === category.id
                                        ? 'bg-[#1a1a24] text-white font-medium'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {category.id === 'courses' ? (
                                        <div className="flex items-center justify-center w-[50px] h-[60px] border-4 border-gray-600 rounded-md relative mr-2">
                                            {/* This specifically recreates the large icon-like layout seen next to Courses if needed, but let's stick to simple lucide icons or stylized text */}
                                            <BookOpen size={24} className={activeCategory === 'courses' ? 'text-white' : 'text-gray-500'} />
                                        </div>
                                    ) : (
                                        <category.icon size={18} className={activeCategory === category.id ? 'text-white' : 'text-gray-500'} />
                                    )}
                                    {category.id !== 'courses' && <span>{category.name}</span>}
                                    {category.id === 'courses' && <span className="absolute left-[80px]">Courses</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 px-2">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Price Range</h3>
                        <div className="px-2">
                            <input
                                type="range"
                                min="0"
                                max="30000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between mt-3 text-[13px] text-gray-400 font-medium">
                                <span>₹0</span>
                                <span>₹{priceRange.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-2">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Sort By</h3>
                        <div className="relative">
                            <select className="w-full appearance-none bg-[#141419] border border-white/5 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-purple-500/50 cursor-pointer text-gray-300">
                                <option>Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
                                <option>Top Rated</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-[#0a0a0f] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[20px] font-bold tracking-wide">All Listings</h2>
                            <span className="text-[13px] text-gray-500 font-medium pt-1">({filteredListings.length} results)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-9 h-9 rounded-lg bg-[#1a1a24] text-white flex items-center justify-center border border-white/5 transition-colors">
                                <Grid size={16} />
                            </button>
                            <button className="w-9 h-9 rounded-lg hover:bg-[#1a1a24] text-gray-500 hover:text-white flex items-center justify-center border border-transparent transition-colors">
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredListings.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => { if (item.videoId) setSelectedVideo(item); }}
                                className="bg-[#0f0f13] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors group flex flex-col h-full shadow-lg cursor-pointer"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 left-3 flex items-center">
                                        <span className="bg-[#10b981] text-white text-[11px] font-bold px-2 py-1 rounded-[6px] tracking-wide">
                                            {item.discount}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(item.id)}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
                                    >
                                        <Heart size={14} className={`transition-colors ${favorites.includes(item.id) ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
                                    </button>
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                        {item.badges.map((badge, idx) => (
                                            <span key={idx} className="bg-[#8b5cf6]/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-[15px] mb-1 line-clamp-2 leading-snug group-hover:text-pink-400 transition-colors">{item.title}</h3>
                                    <p className="text-[12px] text-gray-400 mb-3">{item.vendor}</p>

                                    <div className="flex items-center gap-1.5 mb-5 mt-auto">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-[13px] font-bold">{item.rating}</span>
                                        <span className="text-[11px] text-gray-500">({item.reviews})</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[20px] font-bold tracking-tight">₹{item.price.toLocaleString()}</span>
                                            <span className="text-[12px] text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                                        </div>
                                        <button className="w-9 h-9 rounded-xl bg-[#2d1b36] hover:bg-[#3d2b46] text-[#c084fc] flex items-center justify-center transition-colors">
                                            <ShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Video Modal for Courses */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-4xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white text-xl">{selectedVideo.title}</h3>
                                <button onClick={() => setSelectedVideo(null)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="bg-purple-600/20 text-purple-400 font-bold px-4 py-2 rounded-lg text-sm tracking-wide border border-purple-500/20">
                                        Preview Mode
                                    </span>
                                    <span className="text-gray-400 text-sm">{selectedVideo.vendor}</span>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                                    <ShoppingCart size={18} /> Add to Cart - ₹{selectedVideo.price.toLocaleString()}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DhanGyanMarketplace;
