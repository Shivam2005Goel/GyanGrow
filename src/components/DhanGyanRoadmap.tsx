'use client';

import { useState } from 'react';
import { ArrowLeft, Map, CheckCircle, Lock, Play, Star } from 'lucide-react';

// Glass Card
const GlassCard = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
    return (
        <div className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg ${className}`} style={style}>
            {children}
        </div>
    );
};

// Roadmap Modules
const modules = [
    { id: 1, title: 'Financial Foundations', description: 'Learn basic financial concepts', duration: '4 hours', lessons: 12, progress: 100, status: 'completed', icon: '💰', color: 'from-green-500 to-emerald-600' },
    { id: 2, title: 'Budgeting Basics', description: 'Master the art of budgeting', duration: '6 hours', lessons: 18, progress: 75, status: 'in-progress', icon: '📊', color: 'from-blue-500 to-cyan-600' },
    { id: 3, title: 'Saving Strategies', description: 'Effective saving techniques', duration: '5 hours', lessons: 15, progress: 30, status: 'in-progress', icon: '💎', color: 'from-purple-500 to-pink-600' },
    { id: 4, title: 'Investment Basics', description: 'Start your investment journey', duration: '8 hours', lessons: 24, progress: 0, status: 'locked', icon: '📈', color: 'from-orange-500 to-red-600' },
    { id: 5, title: 'Advanced Investing', description: 'Complex investment strategies', duration: '10 hours', lessons: 30, progress: 0, status: 'locked', icon: '🏆', color: 'from-yellow-500 to-amber-600' },
    { id: 6, title: 'Retirement Planning', description: 'Plan for your future', duration: '7 hours', lessons: 20, progress: 0, status: 'locked', icon: '🏖️', color: 'from-teal-500 to-green-600' }
];

// Animated Background
const AnimatedBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-600 via-blue-500 to-purple-500"></div>
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

const DhanGyanRoadmap = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
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
                    <Map className="text-yellow-400" />
                    AI Roadmap
                </h1>
                <div className="w-20"></div>
            </header>

            <main className="p-4 md:p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">Your Learning Path</h1>
                    <p className="text-xl text-gray-200">Personalized roadmap to financial literacy</p>
                </div>

                {/* Progress Overview */}
                <GlassCard className="mb-12 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Overall Progress</h2>
                        <span className="text-yellow-400 font-bold">35%</span>
                    </div>
                    <div className="w-full h-4 bg-white bg-opacity-20 rounded-full">
                        <div className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-green-400">1</div>
                            <div className="text-gray-300">Completed</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-400">2</div>
                            <div className="text-gray-300">In Progress</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-400">3</div>
                            <div className="text-gray-300">Locked</div>
                        </div>
                    </div>
                </GlassCard>

                {/* Roadmap Timeline */}
                <div className="max-w-4xl mx-auto">
                    {modules.map((module, index) => (
                        <GlassCard
                            key={module.id}
                            className={`mb-6 relative ${module.status === 'locked' ? 'opacity-50' : ''}`}
                        >
                            {/* Connector Line */}
                            {index < modules.length - 1 && (
                                <div className="absolute left-8 top-24 w-0.5 h-16 bg-white bg-opacity-20"></div>
                            )}

                            <div className="flex items-start gap-6">
                                {/* Status Icon */}
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0`}>
                                    {module.status === 'completed' ? (
                                        <CheckCircle size={32} className="text-white" />
                                    ) : module.status === 'locked' ? (
                                        <Lock size={32} className="text-white" />
                                    ) : (
                                        <Play size={32} className="text-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold">{module.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm ${module.status === 'completed' ? 'bg-green-500 bg-opacity-30 text-green-400' :
                                                module.status === 'in-progress' ? 'bg-blue-500 bg-opacity-30 text-blue-400' :
                                                    'bg-gray-500 bg-opacity-30 text-gray-400'
                                            }`}>
                                            {module.status === 'completed' ? '✓ Completed' :
                                                module.status === 'in-progress' ? '▶ In Progress' :
                                                    '🔒 Locked'}
                                        </span>
                                    </div>
                                    <p className="text-gray-200 mb-4">{module.description}</p>

                                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                                        <span className="bg-white bg-opacity-10 px-3 py-1 rounded-full">
                                            {module.duration}
                                        </span>
                                        <span className="bg-white bg-opacity-10 px-3 py-1 rounded-full">
                                            {module.lessons} lessons
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    {module.progress > 0 && (
                                        <div className="w-full h-2 bg-white bg-opacity-20 rounded-full mb-4">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                                                style={{ width: `${module.progress}%` }}
                                            ></div>
                                        </div>
                                    )}

                                    <button
                                        disabled={module.status === 'locked'}
                                        className={`px-6 py-2 rounded-full font-semibold transition-all ${module.status === 'locked'
                                                ? 'bg-gray-500 bg-opacity-30 text-gray-400 cursor-not-allowed'
                                                : module.status === 'completed'
                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                    : 'bg-yellow-400 text-blue-600 hover:bg-white'
                                            }`}
                                    >
                                        {module.status === 'completed' ? 'Review' :
                                            module.status === 'in-progress' ? 'Continue' :
                                                'Unlock'}
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DhanGyanRoadmap;
