'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Utensils, BookOpen, Dumbbell, Coffee } from 'lucide-react';

// TODO: Add your friend's Campus Explorer implementation here
// This component should include:
// - Interactive campus map
// - Building locations and info
// - Navigation/routing between buildings
// - Live occupancy data
// - Travel time estimates

export default function CampusExplorer() {
    const [activeTab, setActiveTab] = useState<'map' | 'facilities' | 'navigation'>('map');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 h-[calc(100vh-140px)] flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Campus Explorer</h2>
                        <p className="text-white/40 text-xs">Interactive campus navigation</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.04]">
                {[
                    { id: 'map', label: 'Map', icon: MapPin },
                    { id: 'facilities', label: 'Facilities', icon: BookOpen },
                    { id: 'navigation', label: 'Navigation', icon: Navigation },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                            activeTab === tab.id
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'text-white/30 hover:text-white/50'
                        }`}
                    >
                        <tab.icon size={13} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Placeholder */}
            <div className="flex-1 bg-[#0c0f17] rounded-2xl border border-white/[0.05] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <MapPin size={32} className="text-emerald-400/50" />
                    </div>
                    <h3 className="text-white/60 font-medium mb-2">Campus Explorer</h3>
                    <p className="text-white/30 text-sm max-w-md mx-auto">
                        This component needs to be added from your friend&apos;s local files.
                        <br />
                        Ask them to share their CampusExplorer.tsx implementation.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
