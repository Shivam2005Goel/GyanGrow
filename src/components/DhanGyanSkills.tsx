'use client';

import { useState } from 'react';
import { ArrowLeft, Brain, Award, Star, Zap, TrendingUp, Target } from 'lucide-react';

// Glass Card
const GlassCard = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
    return (
        <div className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg ${className}`} style={style}>
            {children}
        </div>
    );
};

// Skills Data
const skills = [
    { id: 1, name: 'Budgeting', level: 8, xp: 2400, maxXp: 3000, icon: '💰', color: 'from-green-500 to-emerald-600', badges: ['Novice', 'Intermediate'] },
    { id: 2, name: 'Saving', level: 6, xp: 1800, maxXp: 2500, icon: '💎', color: 'from-blue-500 to-cyan-600', badges: ['Novice'] },
    { id: 3, name: 'Investing', level: 4, xp: 800, maxXp: 2000, icon: '📈', color: 'from-purple-500 to-pink-600', badges: [] },
    { id: 4, name: 'Tax Planning', level: 3, xp: 450, maxXp: 1500, icon: '📋', color: 'from-orange-500 to-red-600', badges: [] },
    { id: 5, name: 'Debt Management', level: 5, xp: 1200, maxXp: 2000, icon: '⚖️', color: 'from-yellow-500 to-amber-600', badges: ['Novice'] },
    { id: 6, name: 'Financial Planning', level: 2, xp: 200, maxXp: 1000, icon: '🎯', color: 'from-teal-500 to-green-600', badges: [] }
];

// Achievements Data
const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: '🌟', earned: true },
    { id: 2, name: 'Quick Learner', description: 'Complete 10 lessons', icon: '⚡', earned: true },
    { id: 3, name: 'Money Master', description: 'Reach level 10 in Budgeting', icon: '👑', earned: false },
    { id: 4, name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', earned: true },
    { id: 5, name: 'Investment Guru', description: 'Complete all investing courses', icon: '🏆', earned: false },
    { id: 6, name: 'Community Star', description: 'Help 100 community members', icon: '⭐', earned: false }
];

// Animated Background
const AnimatedBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-red-500"></div>
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

const DhanGyanSkills = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
    const [activeTab, setActiveTab] = useState('skills');

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
                    <Brain className="text-yellow-400" />
                    Skills & Achievements
                </h1>
                <div className="w-20"></div>
            </header>

            <main className="p-4 md:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">Your Skills</h1>
                    <p className="text-xl text-gray-200">Track your financial literacy progress</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'skills'
                                ? 'bg-yellow-400 text-blue-600'
                                : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                            }`}
                    >
                        Skills
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'achievements'
                                ? 'bg-yellow-400 text-blue-600'
                                : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                            }`}
                    >
                        Achievements
                    </button>
                </div>

                {activeTab === 'skills' ? (
                    /* Skills Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {skills.map((skill, index) => (
                            <GlassCard
                                key={skill.id}
                                className="hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${skill.color} flex items-center justify-center text-3xl`}>
                                        {skill.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{skill.name}</h3>
                                        <p className="text-yellow-400">Level {skill.level}</p>
                                    </div>
                                </div>

                                {/* XP Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{skill.xp} XP</span>
                                        <span>{skill.maxXp} XP</span>
                                    </div>
                                    <div className="w-full h-3 bg-white bg-opacity-20 rounded-full">
                                        <div
                                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                                            style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {skill.badges.map((badge, i) => (
                                        <span key={i} className="bg-yellow-400 bg-opacity-20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                            <Award size={12} />
                                            {badge}
                                        </span>
                                    ))}
                                    {skill.badges.length === 0 && (
                                        <span className="text-gray-400 text-sm">No badges yet</span>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                ) : (
                    /* Achievements Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {achievements.map((achievement, index) => (
                            <GlassCard
                                key={achievement.id}
                                className={`text-center ${achievement.earned ? '' : 'opacity-50'}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${achievement.earned
                                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                        : 'bg-white bg-opacity-10'
                                    }`}>
                                    {achievement.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
                                <p className="text-gray-200 text-sm mb-4">{achievement.description}</p>
                                {achievement.earned ? (
                                    <span className="bg-green-500 bg-opacity-30 text-green-400 px-4 py-1 rounded-full text-sm">
                                        ✓ Earned
                                    </span>
                                ) : (
                                    <span className="bg-gray-500 bg-opacity-30 text-gray-400 px-4 py-1 rounded-full text-sm">
                                        🔒 Locked
                                    </span>
                                )}
                            </GlassCard>
                        ))}
                    </div>
                )}

                {/* Stats Summary */}
                <GlassCard className="mt-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="text-yellow-400" />
                        Your Progress
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-purple-400">6</div>
                            <div className="text-gray-300">Skills</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-yellow-400">33</div>
                            <div className="text-gray-300">Total Level</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400">6,850</div>
                            <div className="text-gray-300">Total XP</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-400">3</div>
                            <div className="text-gray-300">Achievements</div>
                        </div>
                    </div>
                </GlassCard>
            </main>
        </div>
    );
};

export default DhanGyanSkills;
