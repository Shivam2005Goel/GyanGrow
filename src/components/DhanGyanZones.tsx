'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Globe, Map as MapIcon, List, Search,
    Flame, ChevronDown, Navigation, Users, BookOpen, Target,
    MapPin, Plus, Minus
} from 'lucide-react';
import { motion } from 'framer-motion';

import dynamic from 'next/dynamic';

const ZonalMap = dynamic(() => import('./ZonalMap'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-[#0a0d13] z-10 text-white/50">Loading Map...</div>
});

// Mock Data for the Map Points
const zones = [
    { id: '1', name: 'New Delhi', top: '25%', left: '45%', color: 'purple', shadow: 'rgba(168, 85, 247, 0.4)' },
    { id: '2', name: 'Jaipur', top: '32%', left: '42%', color: 'pink', shadow: 'rgba(236, 72, 153, 0.4)' },
    { id: '3', name: 'Kanpur', top: '32%', left: '55%', color: 'yellow', shadow: 'rgba(234, 179, 8, 0.4)' },
    { id: '4', name: 'Kolkata', top: '48%', left: '72%', color: 'teal', shadow: 'rgba(20, 184, 166, 0.4)' },
    { id: '5', name: 'Ahmedabad', top: '45%', left: '33%', color: 'pink', shadow: 'rgba(236, 72, 153, 0.4)' },
    { id: '6', name: 'Bhopal', top: '47%', left: '45%', color: 'red', shadow: 'rgba(239, 68, 68, 0.4)' },
    { id: '7', name: 'Mumbai', top: '60%', left: '35%', color: 'red', shadow: 'rgba(239, 68, 68, 0.4)' },
    { id: '8', name: 'Pune', top: '63%', left: '38%', color: 'yellow', shadow: 'rgba(234, 179, 8, 0.4)' },
    { id: '9', name: 'Hyderabad', top: '65%', left: '48%', color: 'teal', shadow: 'rgba(20, 184, 166, 0.4)' },
    { id: '10', name: 'Bangalore', top: '78%', left: '45%', color: 'blue', shadow: 'rgba(59, 130, 246, 0.4)' },
    { id: '11', name: 'Chennai', top: '78%', left: '53%', color: 'yellow', shadow: 'rgba(234, 179, 8, 0.4)' },
    { id: '12', name: 'Madurai', top: '88%', left: '44%', color: 'teal', shadow: 'rgba(20, 184, 166, 0.4)' },
];

export default function DhanGyanZones() {
    const router = useRouter();



    return (
        <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans overflow-hidden">

            {/* Top Navigation Bar */}
            <div className="h-[72px] border-b border-white/10 flex items-center justify-between px-6 bg-[#11151c] z-50 shrink-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <Globe className="text-purple-400" size={24} />
                        <h1 className="text-xl font-bold tracking-tight">Zonal Learning</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Toggle */}
                    <div className="flex p-1 rounded-xl bg-[#1b2230] border border-white/5">
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 rounded-lg text-sm font-bold shadow-sm">
                            <MapIcon size={16} /> Map
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1.5 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
                            <List size={16} /> List
                        </button>
                    </div>

                    {/* Search */}
                    <div className="flex items-center bg-[#1b2230] border border-white/5 rounded-xl px-4 py-2 w-64 focus-within:ring-1 ring-purple-500 transition-all">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search zones..."
                            className="bg-transparent border-none outline-none text-sm px-3 w-full text-white placeholder-gray-500"
                        />
                    </div>

                    {/* Fire Icon */}
                    <button className="p-2 rounded-xl bg-purple-900/40 text-purple-400 border border-purple-500/20 hover:bg-purple-900/60 transition-colors">
                        <Flame size={20} />
                    </button>

                    {/* Dropdown */}
                    <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1b2230] border border-white/5 text-sm font-medium hover:bg-[#232b3c] transition-colors">
                        All Zones
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex overflow-hidden">

                {/* Map Area */}
                <div className="absolute inset-0 bg-[#0a0d13] z-0 overflow-hidden">
                    <ZonalMap zones={zones} />

                    {/* Floating Summary Badges Bottom Right */}
                    <div className="absolute bottom-6 right-6 z-20 flex gap-3">
                        <div className="flex flex-col items-center justify-center bg-[#1b2230] border border-white/10 rounded-xl px-5 py-3 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-1">
                                <Navigation size={14} className="text-blue-400" />
                                <span className="text-lg font-bold leading-none">12</span>
                            </div>
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Zones</span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-[#1b2230] border border-white/10 rounded-xl px-5 py-3 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-1">
                                <Users size={14} className="text-green-400" />
                                <span className="text-lg font-bold leading-none">126.1K</span>
                            </div>
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Learners</span>
                        </div>
                    </div>

                    {/* Learning Intensity Legend Bottom Left */}
                    <div className="absolute bottom-6 left-[330px] z-20">
                        <div className="bg-[#171c26] border border-white/10 rounded-xl p-5 shadow-2xl">
                            <h4 className="text-sm font-bold text-white mb-4">Learning Intensity</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                    <span className="text-xs text-gray-300">Very High (80%+)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                                    <span className="text-xs text-gray-300">High (60-80%)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
                                    <span className="text-xs text-gray-300">Moderate (40-60%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Sidebar Overlay */}
                <div className="relative z-30 w-[300px] h-full bg-[#11151c]/95 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-[32px] font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent pb-1">
                            Zone Overview
                        </h2>
                        <p className="text-gray-400 text-sm pl-1 font-medium mt-1">
                            Learning across India
                        </p>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {/* Stat Card 1 */}
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/10 transition-colors cursor-default">
                            <Navigation className="text-blue-400 mb-3" size={24} />
                            <h3 className="text-3xl font-bold text-white mb-1">12</h3>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Active Zones</p>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/10 transition-colors cursor-default">
                            <Users className="text-emerald-400 mb-3" size={24} />
                            <h3 className="text-3xl font-bold text-white mb-1">126.1K</h3>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Total Learners</p>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/10 transition-colors cursor-default">
                            <BookOpen className="text-purple-400 mb-3" size={24} />
                            <h3 className="text-3xl font-bold text-white mb-1">413</h3>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Available Courses</p>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/10 transition-colors cursor-default">
                            <Target className="text-yellow-400 mb-3" size={24} />
                            <h3 className="text-3xl font-bold text-white mb-1">70%</h3>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Avg Progress</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
