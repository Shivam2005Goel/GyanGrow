'use client';

import { useState } from 'react';
import { ArrowLeft, Globe, MapPin, Users, BookOpen, Award } from 'lucide-react';

// Glass Card
const GlassCard = ({ children, className = '', style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) => {
    return (
        <div className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg ${className}`} style={style}>
            {children}
        </div>
    );
};

// Zone Data
const zones = [
    { id: 'north', name: 'North Zone', description: 'Delhi, Punjab, Haryana, UP, JK', icon: '🗼', learners: 12500, courses: 45, color: 'from-orange-500 to-red-600' },
    { id: 'south', name: 'South Zone', description: 'Tamil Nadu, Karnataka, Kerala, AP, Telangana', icon: '🌴', learners: 15200, courses: 52, color: 'from-green-500 to-emerald-600' },
    { id: 'east', name: 'East Zone', description: 'West Bengal, Odisha, Bihar, Jharkhand', icon: '🌊', learners: 9800, courses: 38, color: 'from-blue-500 to-cyan-600' },
    { id: 'west', name: 'West Zone', description: 'Maharashtra, Gujarat, Rajasthan', icon: '🏜️', learners: 11400, courses: 48, color: 'from-yellow-500 to-orange-600' },
    { id: 'central', name: 'Central Zone', description: 'MP, Chhattisgarh, Uttarakhand', icon: '🏔️', learners: 7200, courses: 35, color: 'from-purple-500 to-pink-600' },
    { id: 'northeast', name: 'Northeast Zone', description: 'Assam, NE States, Sikkim', icon: '🌸', learners: 5400, courses: 28, color: 'from-teal-500 to-green-600' }
];

// Animated Background
const AnimatedBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500"></div>
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

const DhanGyanZones = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
    const [selectedZone, setSelectedZone] = useState<string | null>(null);

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
                    <Globe className="text-yellow-400" />
                    Zonal Learning
                </h1>
                <div className="w-20"></div>
            </header>

            <main className="p-4 md:p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">Learn by Region</h1>
                    <p className="text-xl text-gray-200">Region-specific financial literacy content for India</p>
                </div>

                {/* Stats */}
                <GlassCard className="mb-12 max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-yellow-400">6</div>
                            <div className="text-gray-300">Zones</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400">61,500</div>
                            <div className="text-gray-300">Total Learners</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-400">246</div>
                            <div className="text-gray-300">Courses</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400">12,500+</div>
                            <div className="text-gray-300">Active This Month</div>
                        </div>
                    </div>
                </GlassCard>

                {/* Zones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {zones.map((zone, index) => (
                        <GlassCard
                            key={zone.id}
                            className="hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => setSelectedZone(zone.id)}
                        >
                            <div className="text-center">
                                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${zone.color} flex items-center justify-center text-5xl mb-4`}>
                                    {zone.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{zone.name}</h3>
                                <p className="text-gray-200 mb-4">{zone.description}</p>

                                <div className="flex justify-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full">
                                        <Users size={14} />
                                        {zone.learners.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1 bg-green-500 bg-opacity-30 px-3 py-1 rounded-full">
                                        <BookOpen size={14} />
                                        {zone.courses}
                                    </span>
                                </div>

                                <button className="mt-4 w-full bg-yellow-400 text-blue-600 py-2 rounded-full font-semibold hover:bg-white transition-all">
                                    Explore Zone
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Zone Details (if selected) */}
                {selectedZone && (
                    <GlassCard className="mt-12 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="text-yellow-400" />
                            {zones.find(z => z.id === selectedZone)?.name} Details
                        </h2>
                        <p className="text-gray-200 mb-6">
                            Explore region-specific courses, local success stories, and government schemes
                            relevant to {zones.find(z => z.id === selectedZone)?.name}.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                                <Award className="mx-auto text-yellow-400 mb-2" size={32} />
                                <h3 className="font-bold mb-1">Top Learners</h3>
                                <p className="text-gray-300">250+ recognized</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                                <BookOpen className="mx-auto text-blue-400 mb-2" size={32} />
                                <h3 className="font-bold mb-1">Local Courses</h3>
                                <p className="text-gray-300">40+ courses</p>
                            </div>
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                                <Globe className="mx-auto text-green-400 mb-2" size={32} />
                                <h3 className="font-bold mb-1">Community</h3>
                                <p className="text-gray-300">5000+ members</p>
                            </div>
                        </div>
                        <button
                            className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-full font-semibold hover:opacity-90"
                            onClick={() => setSelectedZone(null)}
                        >
                            Close
                        </button>
                    </GlassCard>
                )}
            </main>
        </div>
    );
};

export default DhanGyanZones;
