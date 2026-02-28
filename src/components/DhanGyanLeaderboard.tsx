'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, X, Crown, Flame, Sparkles, Star, User, ChevronRight } from 'lucide-react';

const topThree = [
    { rank: 2, name: 'Rahul', xp: '1,18,000', avatar: '👨‍💼', color: 'text-gray-300', glow: 'shadow-[0_0_20px_rgba(156,163,175,0.4)]', bg: 'bg-gray-500/20', border: 'border-gray-500/50' },
    { rank: 1, name: 'Priya', xp: '1,25,000', avatar: '👩‍💼', color: 'text-yellow-400', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.5)]', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
    { rank: 3, name: 'Ananya', xp: '1,05,000', avatar: '👩‍🎓', color: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
];

const listData = [
    { rank: 4, name: 'Arjun Kumar', country: 'IN', lvl: 38, streak: 45, xp: '98,000', tier: 'DIAMOND', tierColor: 'text-fuchsia-500', isUser: false, avatar: '👨‍🎓', bg: 'bg-[#29173a]' },
    { rank: 5, name: 'Neha Gupta', country: 'IN', lvl: 35, streak: 67, xp: '92,000', tier: 'PLATINUM', tierColor: 'text-blue-400', isUser: true, avatar: '👩‍💻', bg: 'bg-[#1b2230]' },
];

const tiers = [
    { name: 'Legend', xp: '1,00,000+ XP', icon: Crown, color: 'text-orange-500', bg: 'bg-orange-600/20' },
    { name: 'Diamond', xp: '50,000+ XP', icon: Sparkles, color: 'text-fuchsia-500', bg: 'bg-fuchsia-600/20' },
    { name: 'Platinum', xp: '15,000+ XP', icon: Trophy, color: 'text-blue-400', bg: 'bg-blue-500/20', active: true },
    { name: 'Gold', xp: '5,000+ XP', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-600/20' },
];

export default function DhanGyanLeaderboard({ onNavigate }: { onNavigate?: (section: string) => void }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Global');

    const handleClose = () => {
        if (onNavigate) {
            onNavigate('dhangyan');
        } else {
            router.back();
        }
    };

    return (
        <div className="min-h-screen bg-[#090510] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden text-white">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[100px] -top-20 -left-20"></div>
                <div className="absolute w-[800px] h-[800px] rounded-full bg-orange-600/5 blur-[120px] bottom-0 right-0"></div>
            </div>

            {/* Leaderboard Modal Container */}
            <div className="w-full max-w-5xl bg-[#1b1928] border border-white/5 rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                {/* Modal Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Trophy className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-wide">Leaderboard</h2>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Sparkles size={10} className="text-purple-400" />
                                Season 5 • Ends in 3 days
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[600px]">

                    {/* Left Panel */}
                    <div className="w-full md:w-80 border-r border-white/5 p-6 flex flex-col gap-6 bg-[#161421]">

                        {/* Current User Card */}
                        <div className="bg-[#211f30] border border-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-[#161421] flex items-center justify-center text-xl">
                                            👩‍💻
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-100">Neha Gupta</h3>
                                    <p className="text-xs text-purple-300 font-medium">Platinum League</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-[#161421] rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
                                    <span className="text-[10px] text-gray-500 font-medium mb-0.5">Total XP</span>
                                    <span className="font-bold text-white text-sm">92,000</span>
                                </div>
                                <div className="flex-1 bg-[#161421] rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
                                    <span className="text-[10px] text-gray-500 font-medium mb-0.5">Rank</span>
                                    <span className="font-bold text-white text-sm">#4</span>
                                </div>
                            </div>
                        </div>

                        {/* League Tiers */}
                        <div className="flex-1 flex flex-col">
                            <h4 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-4">League Tiers</h4>
                            <div className="space-y-3">
                                {tiers.map((tier, idx) => {
                                    const Icon = tier.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${tier.active ? 'bg-[#211f30] border border-white/5' : 'hover:bg-white/5'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl ${tier.bg} flex items-center justify-center ${tier.color}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-bold text-sm text-gray-200">{tier.name}</h5>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{tier.xp}</p>
                                            </div>
                                            {tier.active && (
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 p-6 relative overflow-y-auto custom-scrollbar flex flex-col">

                        {/* Tabs */}
                        <div className="flex items-center gap-2 mb-10 bg-[#161421] p-1.5 rounded-xl border border-white/5 w-max">
                            {['Global', 'Friends', 'State', 'Colleagues'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                                            ? 'bg-white text-[#161421]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Podium Section */}
                        <div className="flex items-end justify-center gap-4 mb-10 mt-8 h-[220px]">
                            {topThree.map((user) => (
                                <div key={user.rank} className="flex flex-col items-center w-[110px] relative">
                                    {user.rank === 1 && (
                                        <div className="absolute -top-12 text-yellow-400 z-20 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                                            <Crown size={32} />
                                        </div>
                                    )}
                                    <div className="relative z-10 mb-[-15px]">
                                        <div className={`w-12 h-12 rounded-xl bg-[#211f30] flex items-center justify-center text-2xl border ${user.border} ${user.glow}`}>
                                            {user.avatar}
                                        </div>
                                    </div>
                                    <div className={`w-full rounded-xl ${user.bg} border-t border-l border-r ${user.border} pt-6 pb-4 flex flex-col items-center ${user.rank === 1 ? 'h-[160px]' : user.rank === 2 ? 'h-[130px]' : 'h-[100px]'}`}>
                                        <div className={`text-2xl font-black ${user.color} opacity-90 mb-1`}>#{user.rank}</div>
                                        <div className="font-bold text-[13px] text-gray-200">{user.name}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">{user.xp}</div>
                                        {user.rank === 1 && <div className="w-[60%] h-[1px] bg-yellow-500/30 mt-3 absolute bottom-4"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* List Items Below Podium */}
                        <div className="space-y-3 flex-1 flex flex-col">
                            {listData.map((user, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center p-3 rounded-2xl border border-white/5 ${user.bg} ${user.isUser ? 'shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : ''}`}
                                >
                                    <div className="w-12 text-center text-sm font-bold text-gray-400">
                                        #{user.rank}
                                    </div>
                                    <div className="relative mr-4 shrink-0">
                                        <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-2xl bg-[#161421]">
                                            {user.avatar}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                                            <Flame size={10} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-bold text-sm text-gray-100">{user.name}</h4>
                                            <span className="text-[10px] font-bold text-gray-500">{user.country}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <div className="text-[10px] text-gray-400 px-2 py-[2px] rounded-md bg-white/5 border border-white/5">Lvl {user.lvl}</div>
                                            <div className="flex items-center gap-1 text-[10px] text-orange-400 font-medium">
                                                <Flame size={10} fill="currentColor" /> {user.streak} day streak
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right pr-4">
                                        <div className="flex items-baseline justify-end gap-1 mb-0.5">
                                            <span className="text-lg font-bold text-white">{user.xp}</span>
                                            <span className="text-[10px] text-gray-500 font-bold tracking-wider">XP</span>
                                        </div>
                                        <div className={`text-[9px] font-black tracking-widest uppercase ${user.tierColor}`}>
                                            {user.tier}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Some CSS for scrollbar if needed */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: rgba(255, 255, 255, 0.1);
                  border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
