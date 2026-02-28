'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Brain, Search, Trophy, Calendar, Filter, Hash, Activity,
    BarChart3, TrendingDown, FileText, Target, Wallet, Calculator,
    Shield, Clock, Coins, Globe, CreditCard, Building2, Landmark, Cpu,
    PiggyBank, BookOpen, Lock, Award, CheckCircle, Zap, Flame, ChevronDown, CheckCircle2
} from 'lucide-react';

const iconMap: any = {
    BarChart3, TrendingDown, FileText, Target, Wallet,
    Calculator, Shield, Clock, Coins, Globe, CreditCard,
    Building2, Landmark, Cpu, PiggyBank, BookOpen
};

const stats = {
    weeklyProgress: 7,
    weeklyGoal: 10,
    totalSkills: 15,
    unlocked: 11,
    mastered: 0,
    dayStreak: 12,
    totalXp: 2570,
    level: 5
};

const categoriesList = [
    { key: 'all', name: 'All Skills', icon: Hash },
    { key: 'investing', name: 'Investing & Trading', icon: Globe },
    { key: 'personal', name: 'Personal Finance', icon: PiggyBank },
    { key: 'fintech', name: 'FinTech & Digital', icon: Cpu },
    { key: 'business', name: 'Business Finance', icon: Building2 },
];

const recentActivity = [
    { type: 'module_complete', text: 'Completed Emergency Fund...', time: '2 hours ago', icon: CheckCircle2, colorClass: 'text-green-400', bgClass: 'bg-green-500/20' },
    { type: 'xp', text: 'Earned 100 XP', time: '5 hours ago', icon: Zap, colorClass: 'text-purple-400', bgClass: 'bg-purple-500/20' },
    { type: 'badge', text: 'Earned Savings Star badge', time: '1 day ago', icon: Award, colorClass: 'text-yellow-400', bgClass: 'bg-yellow-500/20' },
    { type: 'streak', text: '12 day streak!', time: '1 day ago', icon: Flame, colorClass: 'text-orange-400', bgClass: 'bg-orange-500/20' },
];

const skills = [
    {
        id: 1, name: 'Stock Market Basics', description: 'Learn fundamental concepts of stock trading and market analysis',
        locked: false, icon: 'BarChart3', iconBg: 'bg-green-500',
        level: 1, maxLevel: 5, xp: 450, maxXp: 500, progColor: 'from-pink-500 to-pink-500', moduleColor: 'from-cyan-400 to-cyan-500',
        completedModules: 7, totalModules: 8, estimatedTime: '2 weeks'
    },
    {
        id: 2, name: 'Technical Analysis', description: 'Master chart patterns, indicators, and price action strategies',
        locked: false, icon: 'TrendingDown', iconBg: 'bg-green-500',
        level: 2, maxLevel: 5, xp: 320, maxXp: 1000, progColor: 'from-pink-500 to-pink-500', moduleColor: 'from-cyan-400 to-cyan-500',
        completedModules: 3, totalModules: 12, estimatedTime: '4 weeks'
    },
    {
        id: 3, name: 'Fundamental Analysis', description: 'Analyze company financials and economic indicators',
        locked: false, icon: 'FileText', iconBg: 'bg-green-500',
        level: 0, maxLevel: 5, xp: 0, maxXp: 500, progColor: 'bg-white/10', moduleColor: 'bg-white/10',
        completedModules: 0, totalModules: 10, estimatedTime: '3 weeks'
    },
    {
        id: 4, name: 'Options Trading', description: 'Advanced strategies using options contracts',
        locked: true, icon: 'Lock', iconBg: 'bg-gray-400',
        level: 0, maxLevel: 5, xp: 0, maxXp: 500, progColor: 'bg-white/10', moduleColor: 'bg-white/10',
        completedModules: 0, totalModules: 15, estimatedTime: '6 weeks'
    },
    {
        id: 5, name: 'Portfolio Management', description: 'Build and manage diversified investment portfolios',
        locked: true, icon: 'Lock', iconBg: 'bg-gray-400',
        level: 0, maxLevel: 5, xp: 0, maxXp: 500, progColor: 'bg-white/10', moduleColor: 'bg-white/10',
        completedModules: 0, totalModules: 12, estimatedTime: '4 weeks'
    },
    {
        id: 6, name: 'Budgeting Mastery', description: 'Create and maintain effective personal budgets',
        locked: false, icon: 'Calculator', iconBg: 'bg-blue-500',
        level: 3, maxLevel: 5, xp: 1200, maxXp: 1500, progColor: 'from-pink-500 to-pink-500', moduleColor: 'from-cyan-400 to-cyan-500',
        completedModules: 6, totalModules: 8, estimatedTime: '2 weeks'
    }
];

export default function DhanGyanSkills({ onNavigate }: { onNavigate?: (section: string) => void }) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleBack = () => {
        if (onNavigate) {
            onNavigate('dhangyan');
        } else {
            router.back();
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="h-[72px] border-b border-white/10 flex items-center justify-between px-6 bg-[#11151c] z-50 shrink-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <Brain className="text-purple-400" size={24} />
                        <h1 className="text-xl font-bold tracking-tight">Skills Mastery</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search */}
                    <div className="flex items-center bg-[#1b2230] border border-white/5 rounded-xl px-4 py-2 w-72 focus-within:ring-1 ring-purple-500 transition-all">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm px-3 w-full text-white placeholder-gray-500"
                        />
                    </div>

                    {/* XP Bubble */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-gray-200">{stats.totalXp.toLocaleString()} XP</div>
                            <div className="text-xs text-gray-400">Level {stats.level}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Trophy size={18} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Sidebar Overlay */}
                <div className="w-[300px] h-full bg-[#11151c]/95 border-r border-white/10 flex flex-col p-6 shadow-xl shrink-0">

                    {/* Weekly Goal */}
                    <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-5 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold flex items-center gap-2 text-sm text-gray-200">
                                <Calendar size={16} className="text-purple-400" />
                                Weekly Goal
                            </h3>
                            <span className="text-xs text-gray-400">{stats.weeklyProgress}/{stats.weeklyGoal} hours</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-gray-400">
                            {stats.weeklyGoal - stats.weeklyProgress} hours remaining this week
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2 text-sm text-gray-200 px-2">
                            <Filter size={16} className="text-gray-400" />
                            Categories
                        </h3>
                        <div className="space-y-1">
                            {categoriesList.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = selectedCategory === cat.key;
                                return (
                                    <button
                                        key={cat.key}
                                        onClick={() => setSelectedCategory(cat.key)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium ${isActive
                                                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/20'
                                                : 'text-gray-400 hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-5 flex-1 min-h-0 override-overflow overflow-y-auto">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-200">
                            <Activity size={16} className="text-blue-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity, idx) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.bgClass} ${activity.colorClass}`}>
                                            <Icon size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-200 line-clamp-1 break-all pr-2 relative top-[2px]">{activity.text}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content Panel */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0f1219]">

                    {/* KPI Widget Row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
                            <Target size={20} className="text-blue-400 mb-2" />
                            <div className="text-2xl font-bold text-gray-100">{stats.totalSkills}</div>
                            <div className="text-[11px] text-gray-400 mt-1">Total Skills</div>
                        </div>
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
                            <Lock className="text-green-400 mb-2" size={20} />
                            <div className="text-2xl font-bold text-gray-100">{stats.unlocked}</div>
                            <div className="text-[11px] text-gray-400 mt-1">Unlocked</div>
                        </div>
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
                            <CheckCircle size={20} className="text-purple-400 mb-2" />
                            <div className="text-2xl font-bold text-gray-100">{stats.mastered}</div>
                            <div className="text-[11px] text-gray-400 mt-1">Mastered</div>
                        </div>
                        <div className="bg-[#1b2230] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
                            <Flame size={20} className="text-orange-400 mb-2" />
                            <div className="text-2xl font-bold text-gray-100">{stats.dayStreak}</div>
                            <div className="text-[11px] text-gray-400 mt-1">Day Streak</div>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                            <select className="appearance-none bg-[#1b2230] border border-white/5 text-sm font-medium text-gray-200 py-2 pl-4 pr-10 rounded-xl outline-none hover:bg-[#232b3c] cursor-pointer">
                                <option>All Skills</option>
                                <option>Unlocked</option>
                                <option>Locked</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="px-3 py-1.5 bg-purple-600/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20">
                            15 skills
                        </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
                        {skills.map((skill) => {
                            const IconComp = iconMap[skill.icon] || BookOpen;
                            const isLocked = skill.locked;
                            const modProgPercentage = skill.totalModules ? (skill.completedModules / skill.totalModules) * 100 : 0;
                            const xpPercentage = skill.maxXp ? (skill.xp / skill.maxXp) * 100 : 0;

                            return (
                                <div key={skill.id} className={`bg-[#1b2230] border border-white/5 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-white/10 transition-colors ${isLocked ? 'opacity-80' : ''}`}>
                                    {isLocked && <div className="absolute inset-0 bg-black/10 z-10 pointers-events-none"></div>}

                                    {/* Top Icon and Dots Row */}
                                    <div className="flex justify-between items-start mb-4 relative z-20">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLocked ? 'bg-gray-600' : skill.iconBg}`}>
                                            <IconComp size={18} className="text-white" />
                                        </div>

                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(skill.maxLevel)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${i < skill.level
                                                            ? 'bg-yellow-400'
                                                            : 'bg-white/20'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Text Context */}
                                    <div className="relative z-20 mb-4 min-h-[40px]">
                                        <h3 className={`font-bold text-base mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-100 group-hover:text-purple-300 transition-colors'}`}>{skill.name}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{skill.description}</p>
                                    </div>

                                    {/* Progress Bars (only if unlocked) */}
                                    {!isLocked && (
                                        <div className="space-y-4 mb-4">
                                            {/* Modules Progress */}
                                            <div>
                                                <div className="flex justify-between text-[11px] mb-1.5">
                                                    <span className="text-gray-500">{skill.completedModules}/{skill.totalModules} Modules</span>
                                                    <span className="font-bold text-cyan-400">{Math.round(modProgPercentage)}%</span>
                                                </div>
                                                <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-gradient-to-r ${skill.moduleColor} rounded-full`} style={{ width: `${modProgPercentage}%` }}></div>
                                                </div>
                                            </div>

                                            {/* XP Progress */}
                                            <div>
                                                <div className="flex justify-between text-[11px] mb-1.5">
                                                    <span className="text-gray-500">Level {skill.level}</span>
                                                    <span className="font-bold text-pink-400">{skill.xp}/{skill.maxXp} XP</span>
                                                </div>
                                                <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-gradient-to-r ${skill.progColor} rounded-full`} style={{ width: `${xpPercentage}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Locked placeholder space */}
                                    {isLocked && <div className="h-[80px]"></div>}

                                    {/* Bottom Info line */}
                                    <div className="flex items-center gap-4 text-[11px] text-gray-500 border-t border-white/5 pt-3 mt-auto relative z-20">
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen size={12} />
                                            <span>{skill.totalModules} modules</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} />
                                            <span>{skill.estimatedTime}</span>
                                        </div>

                                        {!isLocked && skill.level > 0 && (
                                            <div className="ml-auto text-yellow-400">
                                                <Award size={14} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}
