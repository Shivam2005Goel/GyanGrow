'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Target,
    Zap,
    Award,
    Star,
    Code,
    Palette,
    Mic,
    Globe,
    Calculator,
    Brain,
    X,
    ChevronUp,
    ChevronDown,
    CheckCircle
} from 'lucide-react';

interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    targetLevel: number;
    xp: number;
    color: string;
}

const categories = [
    { id: 'technical', name: 'Technical', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'design', name: 'Design', icon: Palette, color: 'from-pink-500 to-rose-500' },
    { id: 'communication', name: 'Communication', icon: Mic, color: 'from-amber-500 to-orange-500' },
    { id: 'languages', name: 'Languages', icon: Globe, color: 'from-emerald-500 to-teal-500' },
    { id: 'analytical', name: 'Analytical', icon: Calculator, color: 'from-violet-500 to-purple-500' },
    { id: 'leadership', name: 'Leadership', icon: Star, color: 'from-cyan-500 to-blue-500' },
];

const skillColors = [
    'from-blue-500 to-cyan-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-violet-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-rose-500 to-red-500',
    'from-lime-500 to-green-500',
];

export default function SkillTracker() {
    const [skills, setSkills] = useState<Skill[]>([
        { id: '1', name: 'Python Programming', category: 'technical', level: 75, targetLevel: 90, xp: 750, color: skillColors[0] },
        { id: '2', name: 'Machine Learning', category: 'technical', level: 60, targetLevel: 85, xp: 600, color: skillColors[1] },
        { id: '3', name: 'UI/UX Design', category: 'design', level: 45, targetLevel: 70, xp: 450, color: skillColors[2] },
        { id: '4', name: 'Public Speaking', category: 'communication', level: 55, targetLevel: 80, xp: 550, color: skillColors[3] },
        { id: '5', name: 'Data Structures', category: 'analytical', level: 80, targetLevel: 95, xp: 800, color: skillColors[4] },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newSkill, setNewSkill] = useState({ name: '', category: 'technical', targetLevel: 80 });
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const addSkill = () => {
        if (!newSkill.name.trim()) return;

        const skill: Skill = {
            id: Date.now().toString(),
            name: newSkill.name,
            category: newSkill.category,
            level: 0,
            targetLevel: newSkill.targetLevel,
            xp: 0,
            color: skillColors[Math.floor(Math.random() * skillColors.length)],
        };

        setSkills([...skills, skill]);
        setNewSkill({ name: '', category: 'technical', targetLevel: 80 });
        setShowAddModal(false);
    };

    const deleteSkill = (id: string) => {
        setSkills(skills.filter(s => s.id !== id));
    };

    const updateLevel = (id: string, delta: number) => {
        setSkills(skills.map(s => {
            if (s.id === id) {
                const newLevel = Math.max(0, Math.min(100, s.level + delta));
                const xpGained = delta > 0 ? delta * 10 : 0;
                return {
                    ...s,
                    level: newLevel,
                    xp: s.xp + xpGained
                };
            }
            return s;
        }));
    };

    const filteredSkills = selectedCategory === 'all'
        ? skills
        : skills.filter(s => s.category === selectedCategory);

    const totalXP = skills.reduce((acc, s) => acc + s.xp, 0);
    const avgProgress = skills.length > 0
        ? Math.round(skills.reduce((acc, s) => acc + (s.level / s.targetLevel * 100), 0) / skills.length)
        : 0;
    const completedSkills = skills.filter(s => s.level >= s.targetLevel).length;

    const getCategoryIcon = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.icon : Target;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white/90">Skill Tracker</h2>
                    <p className="text-sm text-white/40">Track and improve your skills</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Skill</span>
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                            <Zap size={20} className="text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white/90">{totalXP}</p>
                            <p className="text-xs text-white/40">Total XP</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                            <Target size={20} className="text-violet-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white/90">{avgProgress}%</p>
                            <p className="text-xs text-white/40">Avg Progress</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                            <CheckCircle size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white/90">{completedSkills}</p>
                            <p className="text-xs text-white/40">Mastered</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                            <Star size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white/90">{skills.length}</p>
                            <p className="text-xs text-white/40">Active Skills</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === 'all'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1]'
                        }`}
                >
                    All Skills
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === cat.id
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1]'
                            }`}
                    >
                        <cat.icon size={14} />
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {filteredSkills.map((skill, index) => {
                        const CategoryIcon = getCategoryIcon(skill.category);
                        const progress = (skill.level / skill.targetLevel) * 100;
                        const isMastered = skill.level >= skill.targetLevel;

                        return (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white/[0.03] backdrop-blur-xl border rounded-2xl p-5 hover:border-white/10 transition-all ${isMastered ? 'border-emerald-500/30' : 'border-white/[0.06]'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center`}>
                                            <CategoryIcon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white/90">{skill.name}</h3>
                                            <p className="text-xs text-white/40 capitalize">{skill.category}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteSkill(skill.id)}
                                        className="p-2 rounded-xl hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                                        <span className="text-white/50">Level {skill.level}</span>
                                        <span className="text-white/30">Target: {skill.targetLevel}</span>
                                    </div>
                                    <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${skill.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, progress)}%` }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateLevel(skill.id, -5)}
                                            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white/70 transition-colors"
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                        <button
                                            onClick={() => updateLevel(skill.id, 5)}
                                            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white/70 transition-colors"
                                        >
                                            <ChevronUp size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Zap size={14} className="text-amber-400" />
                                        <span className="text-white/60">{skill.xp} XP</span>
                                    </div>
                                </div>

                                {isMastered && (
                                    <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                                        <Award size={14} />
                                        <span>Skill Mastered!</span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredSkills.length === 0 && (
                <div className="text-center py-12 text-white/30">
                    <Brain size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No skills in this category</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 text-cyan-400 hover:text-cyan-300"
                    >
                        Add your first skill
                    </button>
                </div>
            )}

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-white/40 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-bold text-white/90 mb-6">Add New Skill</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/50 mb-2">Skill Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., React.js, Photography"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/50 mb-2">Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setNewSkill({ ...newSkill, category: cat.id })}
                                                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${newSkill.category === cat.id
                                                        ? 'bg-cyan-500/20 border border-cyan-500/30'
                                                        : 'bg-white/[0.05] border border-transparent hover:bg-white/[0.1]'
                                                    }`}
                                            >
                                                <cat.icon size={20} className={newSkill.category === cat.id ? 'text-cyan-400' : 'text-white/50'} />
                                                <span className={`text-xs ${newSkill.category === cat.id ? 'text-cyan-400' : 'text-white/40'}`}>
                                                    {cat.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/50 mb-2">Target Level (1-100)</label>
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        value={newSkill.targetLevel}
                                        onChange={(e) => setNewSkill({ ...newSkill, targetLevel: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-white/30 mt-1">
                                        <span>10</span>
                                        <span className="text-cyan-400 font-bold">{newSkill.targetLevel}</span>
                                        <span>100</span>
                                    </div>
                                </div>

                                <button
                                    onClick={addSkill}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity mt-4"
                                >
                                    Add Skill
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
