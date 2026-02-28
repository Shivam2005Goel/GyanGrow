'use client';

import { useState } from 'react';
import { ArrowLeft, Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Glass Card
const GlassCard = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
    return (
        <div className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg ${className}`} style={style}>
            {children}
        </div>
    );
};

// Leaderboard Data
const leaderboardData = [
    { rank: 1, name: 'Priya Sharma', xp: 15420, avatar: '👩‍💼', tier: 'Diamond', change: 2, streak: 45 },
    { rank: 2, name: 'Anita Verma', xp: 14200, avatar: '👩‍🔬', tier: 'Platinum', change: -1, streak: 38 },
    { rank: 3, name: 'Richa Singh', xp: 12850, avatar: '👩‍🎓', tier: 'Platinum', change: 1, streak: 30 },
    { rank: 4, name: 'You', xp: 7500, avatar: '🧙‍♂️', tier: 'Gold', change: 3, streak: 7, isUser: true },
    { rank: 5, name: 'Meera Patel', xp: 6100, avatar: '👩‍💻', tier: 'Gold', change: -2, streak: 15 },
    { rank: 6, name: 'Sneha Gupta', xp: 5450, avatar: '👩‍🎨', tier: 'Silver', change: 0, streak: 12 },
    { rank: 7, name: 'Kavita Rao', xp: 4800, avatar: '👩‍🔧', tier: 'Silver', change: 4, streak: 8 },
    { rank: 8, name: 'Sunita Devi', xp: 4200, avatar: '👩‍🏫', tier: 'Silver', change: -1, streak: 5 },
    { rank: 9, name: 'Pooja Sharma', xp: 3800, avatar: '👩‍⚕️', tier: 'Bronze', change: 2, streak: 3 },
    { rank: 10, name: 'Rekha Singh', xp: 3400, avatar: '👩‍🌾', tier: 'Bronze', change: -3, streak: 2 }
];

// Animated Background
const AnimatedBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-600 via-orange-500 to-red-500"></div>
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white opacity-10 animate-float"
                    style={{
                        width: `${Math.random() * 80 + 40}px`,
                        height: `${Math.random() * 80 + 40}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                ></div>
            ))}
        </div>
    );
};

const DhanGyanLeaderboard = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
    const [timeFilter, setTimeFilter] = useState('weekly');

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Diamond': return 'bg-cyan-400 text-black';
            case 'Platinum': return 'bg-gray-300 text-black';
            case 'Gold': return 'bg-yellow-400 text-black';
            case 'Silver': return 'bg-gray-400 text-white';
            default: return 'bg-orange-700 text-white';
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="text-yellow-400" size={24} />;
            case 2: return <Medal className="text-gray-300" size={24} />;
            case 3: return <Medal className="text-orange-400" size={24} />;
            default: return <span className="font-bold text-gray-400">#{rank}</span>;
        }
    };

    return (
        <div className="min-h-screen text-white relative" style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' }}>
            <AnimatedBackground />

            {/* Header */}
            <header className="p-4 md:p-6 flex items-center justify-between">
                <button
                    onClick={() => onNavigate?.('dhangyan')}
                    className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
                >
                    <ArrowLeft size={24} />
                    <span>Back</span>
                </button>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="text-yellow-400" />
                    Leaderboard
                </h1>
                <div className="w-20"></div>
            </header>

            <main className="p-4 md:p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">Top Learners</h1>
                    <p className="text-xl text-gray-200">Compete with the best and climb the ranks!</p>
                </div>

                {/* Time Filters */}
                <div className="flex justify-center gap-4 mb-8">
                    {['daily', 'weekly', 'monthly', 'all-time'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${timeFilter === filter
                                    ? 'bg-yellow-400 text-blue-600'
                                    : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                                }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Podium */}
                <div className="flex justify-center items-end gap-4 mb-12 max-w-4xl mx-auto">
                    {/* 2nd Place */}
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-5xl mb-2">
                                {leaderboardData[1].avatar}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-300 text-black px-3 py-1 rounded-full font-bold">
                                #2
                            </div>
                        </div>
                        <div className="bg-gray-500 bg-opacity-30 p-4 rounded-t-lg mt-2">
                            <p className="font-bold">{leaderboardData[1].name}</p>
                            <p className="text-yellow-400">{leaderboardData[1].xp.toLocaleString()} XP</p>
                        </div>
                        <div className="h-24 bg-gradient-to-t from-gray-400 to-transparent"></div>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center transform scale-110">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-6xl mb-2 ring-4 ring-yellow-400">
                                {leaderboardData[0].avatar}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
                                #1
                            </div>
                        </div>
                        <div className="bg-yellow-500 bg-opacity-30 p-4 rounded-t-lg mt-2">
                            <p className="font-bold">{leaderboardData[0].name}</p>
                            <p className="text-yellow-400">{leaderboardData[0].xp.toLocaleString()} XP</p>
                        </div>
                        <div className="h-32 bg-gradient-to-t from-yellow-500 to-transparent"></div>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-5xl mb-2">
                                {leaderboardData[2].avatar}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-black px-3 py-1 rounded-full font-bold">
                                #3
                            </div>
                        </div>
                        <div className="bg-orange-600 bg-opacity-30 p-4 rounded-t-lg mt-2">
                            <p className="font-bold">{leaderboardData[2].name}</p>
                            <p className="text-yellow-400">{leaderboardData[2].xp.toLocaleString()} XP</p>
                        </div>
                        <div className="h-16 bg-gradient-to-t from-orange-600 to-transparent"></div>
                    </div>
                </div>

                {/* Full Leaderboard */}
                <GlassCard className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold mb-6">Full Rankings</h2>
                    <div className="space-y-3">
                        {leaderboardData.map((user) => (
                            <div
                                key={user.rank}
                                className={`flex items-center justify-between p-4 rounded-lg ${user.isUser
                                        ? 'bg-purple-500 bg-opacity-30 border border-purple-400'
                                        : 'bg-white bg-opacity-5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 text-center">
                                        {user.rank <= 3 ? getRankIcon(user.rank) : (
                                            <span className="font-bold text-gray-400">#{user.rank}</span>
                                        )}
                                    </div>
                                    <span className="text-3xl">{user.avatar}</span>
                                    <div>
                                        <p className={`font-bold ${user.isUser ? 'text-purple-300' : ''}`}>
                                            {user.name}
                                            {user.isUser && <span className="ml-2 text-xs bg-purple-500 px-2 py-0.5 rounded-full">You</span>}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${getTierColor(user.tier)}`}>
                                                {user.tier}
                                            </span>
                                            <span className="text-gray-400">🔥 {user.streak} days</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-yellow-400 font-bold text-lg">{user.xp.toLocaleString()}</p>
                                        <p className="text-gray-400 text-xs">XP</p>
                                    </div>
                                    <div className={`flex items-center ${user.change > 0 ? 'text-green-400' :
                                            user.change < 0 ? 'text-red-400' : 'text-gray-400'
                                        }`}>
                                        {user.change > 0 ? <TrendingUp size={20} /> :
                                            user.change < 0 ? <TrendingDown size={20} /> :
                                                <Minus size={20} />}
                                        <span className="ml-1">{Math.abs(user.change)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </main>
        </div>
    );
};

export default DhanGyanLeaderboard;
