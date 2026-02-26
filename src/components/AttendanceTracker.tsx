'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Plus, Trash2, AlertTriangle, CheckCircle2, TrendingUp,
    Calculator, BookOpen, Target, Award, Clock, Minus, ChevronDown,
    AlertCircle, Sparkles, GraduationCap, Calendar, Sun, Moon,
    Flame, Trophy, History, Download, Upload, RotateCcw, Bell,
    Zap, Target as TargetIcon, LineChart, CheckSquare, Square
} from 'lucide-react';

interface AttendanceRecord {
    date: string; // YYYY-MM-DD
    session: 'morning' | 'afternoon' | 'full';
    present: boolean;
}

interface Subject {
    id: string;
    name: string;
    code: string;
    attended: number;
    total: number;
    credits: number;
    grade: string;
    records: AttendanceRecord[];
    targetPercentage: number;
    streak: number;
    longestStreak: number;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

const GRADES = [
    { grade: 'S', points: 10 },
    { grade: 'A', points: 9 },
    { grade: 'B', points: 8 },
    { grade: 'C', points: 7 },
    { grade: 'D', points: 6 },
    { grade: 'E', points: 5 },
    { grade: 'F', points: 0 },
];

const ACHIEVEMENTS: Achievement[] = [
    { id: 'perfect_week', name: 'Perfect Week', description: '100% attendance for a full week', icon: '🎯', unlocked: false },
    { id: 'streak_10', name: 'On Fire', description: '10 classes in a row attended', icon: '🔥', unlocked: false },
    { id: 'streak_30', name: 'Unstoppable', description: '30 classes in a row attended', icon: '⚡', unlocked: false },
    { id: 'early_bird', name: 'Early Bird', description: 'Mark attendance before 8 AM', icon: '🌅', unlocked: false },
    { id: 'comeback', name: 'Comeback Kid', description: 'Recover from below 60% to above 75%', icon: '💪', unlocked: false },
    { id: 'subject_master', name: 'Subject Master', description: '100% in a subject for 20 classes', icon: '👑', unlocked: false },
];

const SESSIONS = [
    { id: 'morning' as const, label: 'Morning', time: '8AM - 12PM', icon: Sun },
    { id: 'afternoon' as const, label: 'Afternoon', time: '1PM - 5PM', icon: Moon },
    { id: 'full' as const, label: 'Full Day', time: '8AM - 5PM', icon: Calendar },
];

export default function AttendanceTracker() {
    const [activeView, setActiveView] = useState<'attendance' | 'cgpa' | 'history' | 'analytics'>('attendance');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCode, setNewCode] = useState('');
    const [newCredits, setNewCredits] = useState('3');
    const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
    const [showBulkAction, setShowBulkAction] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [historyDate, setHistoryDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSession, setSelectedSession] = useState<'morning' | 'afternoon' | 'full'>('morning');
    const [showExport, setShowExport] = useState(false);

    // Load data
    useEffect(() => {
        const saved = localStorage.getItem('vitgroww_attendance');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSubjects(parsed.subjects || []);
                setAchievements(parsed.achievements || ACHIEVEMENTS);
            } catch { }
        }
    }, []);

    // Save data
    useEffect(() => {
        if (subjects.length > 0 || achievements.length > 0) {
            localStorage.setItem('vitgroww_attendance', JSON.stringify({ subjects, achievements }));
        }
    }, [subjects, achievements]);

    const addSubject = () => {
        if (!newName.trim()) return;
        const subject: Subject = {
            id: `sub-${Date.now()}`,
            name: newName,
            code: newCode || 'SUB',
            attended: 0,
            total: 0,
            credits: Number(newCredits) || 3,
            grade: 'S',
            records: [],
            targetPercentage: 75,
            streak: 0,
            longestStreak: 0,
        };
        setSubjects(prev => [...prev, subject]);
        setNewName('');
        setNewCode('');
        setShowAdd(false);
    };

    const deleteSubject = (id: string) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
        setSelectedSubjects(prev => prev.filter(sid => sid !== id));
    };

    const toggleSubjectSelection = (id: string) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const markBulkPresent = () => {
        const date = historyDate;
        const session = selectedSession;

        setSubjects(prev => prev.map(s => {
            if (!selectedSubjects.includes(s.id)) return s;

            // Check if already marked for this date/session
            const existingRecord = s.records.find(r => r.date === date && r.session === session);
            if (existingRecord) return s;

            const newRecord: AttendanceRecord = { date, session, present: true };
            const newRecords = [...s.records, newRecord];

            // Calculate new streak
            let newStreak = s.streak;
            let newLongestStreak = s.longestStreak;

            // Simple streak logic - increment if consecutive
            if (s.total > 0 && s.total >= s.streak) {
                newStreak = s.streak + 1;
                newLongestStreak = Math.max(s.longestStreak, newStreak);
            }

            return {
                ...s,
                attended: s.attended + 1,
                total: s.total + 1,
                records: newRecords,
                streak: newStreak,
                longestStreak: newLongestStreak,
            };
        }));

        setShowBulkAction(false);
        checkAchievements();
    };

    const markBulkAbsent = () => {
        const date = historyDate;
        const session = selectedSession;

        setSubjects(prev => prev.map(s => {
            if (!selectedSubjects.includes(s.id)) return s;

            const existingRecord = s.records.find(r => r.date === date && r.session === session);
            if (existingRecord) return s;

            const newRecord: AttendanceRecord = { date, session, present: false };

            return {
                ...s,
                total: s.total + 1,
                records: [...s.records, newRecord],
                streak: 0, // Reset streak on absence
            };
        }));

        setShowBulkAction(false);
    };

    const markPresent = (id: string) => {
        const date = historyDate;
        const session = selectedSession;

        setSubjects(prev => prev.map(s => {
            if (s.id !== id) return s;

            const existingRecord = s.records.find(r => r.date === date && r.session === session);
            if (existingRecord) return s;

            const newRecord: AttendanceRecord = { date, session, present: true };
            let newStreak = s.streak;
            let newLongestStreak = s.longestStreak;

            // Increment streak
            newStreak = s.streak + 1;
            newLongestStreak = Math.max(s.longestStreak, newStreak);

            return {
                ...s,
                attended: s.attended + 1,
                total: s.total + 1,
                records: [...s.records, newRecord],
                streak: newStreak,
                longestStreak: newLongestStreak,
            };
        }));

        checkAchievements();
    };

    const markAbsent = (id: string) => {
        const date = historyDate;
        const session = selectedSession;

        setSubjects(prev => prev.map(s => {
            if (s.id !== id) return s;

            const existingRecord = s.records.find(r => r.date === date && r.session === session);
            if (existingRecord) return s;

            const newRecord: AttendanceRecord = { date, session, present: false };

            return {
                ...s,
                total: s.total + 1,
                records: [...s.records, newRecord],
                streak: 0,
            };
        }));
    };

    const undoLastMark = (id: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== id || s.records.length === 0) return s;

            const lastRecord = s.records[s.records.length - 1];
            const newRecords = s.records.slice(0, -1);

            return {
                ...s,
                attended: lastRecord.present ? s.attended - 1 : s.attended,
                total: s.total > 0 ? s.total - 1 : 0,
                records: newRecords,
            };
        }));
    };

    const updateGrade = (id: string, grade: string) => {
        setSubjects(prev => prev.map(s =>
            s.id === id ? { ...s, grade } : s
        ));
    };

    const updateTarget = (id: string, target: number) => {
        setSubjects(prev => prev.map(s =>
            s.id === id ? { ...s, targetPercentage: target } : s
        ));
    };

    const getPercentage = (s: Subject) => s.total === 0 ? 100 : Math.round((s.attended / s.total) * 100);

    const getColor = (pct: number, target: number = 75) => pct >= target ? '#10b981' : pct >= target - 15 ? '#f59e0b' : '#ef4444';
    const getStatusText = (pct: number, target: number = 75) => pct >= target + 15 ? 'Excellent' : pct >= target ? 'Safe' : pct >= target - 15 ? 'Warning' : 'Danger';

    const canMiss = (s: Subject) => {
        if (s.total === 0) return 99;
        const target = s.targetPercentage / 100;
        const maxMissable = Math.floor(s.attended / target - s.total);
        return Math.max(0, maxMissable);
    };

    const needToAttend = (s: Subject) => {
        if (getPercentage(s) >= s.targetPercentage) return 0;
        const target = s.targetPercentage / 100;
        const total = s.total;
        const attended = s.attended;
        // (attended + x) / (total + x) >= target
        // attended + x >= target * total + target * x
        // x - target * x >= target * total - attended
        // x >= (target * total - attended) / (1 - target)
        const needed = Math.ceil((target * total - attended) / (1 - target));
        return Math.max(0, needed);
    };

    // CGPA calculation
    const cgpa = useMemo(() => {
        const withGrades = subjects.filter(s => s.grade !== 'F' || true);
        if (withGrades.length === 0) return 0;
        const totalPoints = withGrades.reduce((sum, s) => {
            const gradePoint = GRADES.find(g => g.grade === s.grade)?.points || 0;
            return sum + (gradePoint * s.credits);
        }, 0);
        const totalCredits = withGrades.reduce((sum, s) => sum + s.credits, 0);
        return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
    }, [subjects]);

    const overallAttendance = useMemo(() => {
        const totalAttended = subjects.reduce((s, sub) => s + sub.attended, 0);
        const totalClasses = subjects.reduce((s, sub) => s + sub.total, 0);
        return totalClasses === 0 ? 100 : Math.round((totalAttended / totalClasses) * 100);
    }, [subjects]);

    const dangerSubjects = subjects.filter(s => getPercentage(s) < s.targetPercentage && s.total > 0);

    const checkAchievements = () => {
        setAchievements(prev => {
            const newAchievements = [...prev];

            // Check streak achievements
            subjects.forEach(s => {
                if (s.streak >= 10) {
                    const idx = newAchievements.findIndex(a => a.id === 'streak_10');
                    if (idx >= 0) newAchievements[idx].unlocked = true;
                }
                if (s.streak >= 30) {
                    const idx = newAchievements.findIndex(a => a.id === 'streak_30');
                    if (idx >= 0) newAchievements[idx].unlocked = true;
                }
            });

            return newAchievements;
        });
    };

    const exportData = () => {
        const data = {
            subjects,
            achievements,
            exportDate: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gyangrow-attendance-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setShowExport(false);
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.subjects) setSubjects(data.subjects);
                if (data.achievements) setAchievements(data.achievements);
            } catch (err) {
                console.error('Import failed', err);
            }
        };
        reader.readAsText(file);
    };

    // Get unique dates from records
    const uniqueDates = useMemo(() => {
        const dates = new Set<string>();
        subjects.forEach(s => s.records.forEach(r => dates.add(r.date)));
        return Array.from(dates).sort().reverse();
    }, [subjects]);

    // Weekly stats
    const weeklyStats = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        let attended = 0;
        let total = 0;

        subjects.forEach(s => {
            s.records.forEach(r => {
                const recordDate = new Date(r.date);
                if (recordDate >= weekAgo && recordDate <= now) {
                    total++;
                    if (r.present) attended++;
                }
            });
        });

        return { attended, total, percentage: total > 0 ? Math.round((attended / total) * 100) : 100 };
    }, [subjects]);

    const unlockedAchievements = achievements.filter(a => a.unlocked).length;

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/10">
                        <BarChart3 size={28} className="text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Attendance & CGPA</h2>
                        <p className="text-white/40 text-sm flex items-center gap-2">
                            <Flame size={14} className="text-orange-400" />
                            {unlockedAchievements} achievements unlocked
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white/[0.03] rounded-xl border border-white/[0.06] p-1">
                        {[
                            { id: 'attendance' as const, label: 'Track', icon: TargetIcon },
                            { id: 'history' as const, label: 'History', icon: History },
                            { id: 'analytics' as const, label: 'Analytics', icon: LineChart },
                            { id: 'cgpa' as const, label: 'CGPA', icon: GraduationCap },
                        ].map(v => (
                            <button key={v.id} onClick={() => setActiveView(v.id)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${activeView === v.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/80'}`}>
                                <v.icon size={14} /> {v.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setShowExport(!showExport)}
                            className="px-3 py-2.5 bg-white/[0.05] text-white/60 font-semibold rounded-xl flex items-center gap-2 border border-white/[0.06]">
                            <Download size={16} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAdd(!showAdd)}
                            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                            <Plus size={18} /> Add
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Export/Import Panel */}
            <AnimatePresence>
                {showExport && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 flex-shrink-0 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                                <button onClick={exportData} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
                                    <Download size={16} /> Export Data
                                </button>
                                <label className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg text-sm flex items-center gap-2 cursor-pointer">
                                    <Upload size={16} /> Import Data
                                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                                </label>
                            </div>
                            <p className="text-white/30 text-xs">Export your attendance data as JSON</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Danger Alert */}
            {dangerSubjects.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 flex-shrink-0">
                    <AlertTriangle size={20} className="text-rose-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-rose-400 text-sm font-semibold">Attendance below target in {dangerSubjects.length} subject{dangerSubjects.length > 1 ? 's' : ''}</p>
                        <p className="text-rose-400/60 text-xs">{dangerSubjects.map(s => s.code).join(', ')} — You may face debarment!</p>
                    </div>
                    <button onClick={() => setActiveView('analytics')} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 rounded-lg text-xs">
                        View Analysis
                    </button>
                </motion.div>
            )}

            {/* Add Subject */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 flex-shrink-0 overflow-hidden">
                        <div className="grid grid-cols-4 gap-4">
                            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Subject Name"
                                className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/40" />
                            <input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Code (e.g., CSE2011)"
                                className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/40" />
                            <input type="number" value={newCredits} onChange={e => setNewCredits(e.target.value)} placeholder="Credits"
                                className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/40" />
                            <button onClick={addSubject} className="py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all">
                                Add Subject
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Date & Session Selector */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
                    <input type="date" value={historyDate} onChange={e => setHistoryDate(e.target.value)}
                        className="bg-transparent text-white text-sm px-3 py-2 outline-none" />
                </div>
                <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
                    {SESSIONS.map(session => (
                        <button key={session.id} onClick={() => setSelectedSession(session.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${selectedSession === session.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/80'}`}>
                            <session.icon size={12} /> {session.label}
                        </button>
                    ))}
                </div>
                {selectedSubjects.length > 0 && (
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setShowBulkAction(!showBulkAction)}
                        className="px-3 py-1.5 bg-violet-500/20 text-violet-400 rounded-lg text-xs flex items-center gap-1">
                        <CheckSquare size={12} /> {selectedSubjects.length} selected
                    </motion.button>
                )}
            </div>

            {/* Bulk Action Panel */}
            <AnimatePresence>
                {showBulkAction && selectedSubjects.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-violet-400 text-sm font-medium">Bulk Mark for {historyDate} - {selectedSession}:</span>
                                <button onClick={markBulkPresent} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
                                    <CheckCircle2 size={16} /> All Present
                                </button>
                                <button onClick={markBulkAbsent} className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> All Absent
                                </button>
                            </div>
                            <button onClick={() => { setShowBulkAction(false); setSelectedSubjects([]); }} className="text-white/40 hover:text-white">
                                ✕
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                <AnimatePresence mode="wait">
                    {/* ATTENDANCE VIEW */}
                    {activeView === 'attendance' && (
                        <motion.div key="att" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            {/* Overview Stats */}
                            <div className="grid grid-cols-5 gap-4">
                                {[
                                    { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'cyan' },
                                    { label: 'Overall', value: `${overallAttendance}%`, icon: Target, color: overallAttendance >= 75 ? 'emerald' : 'rose' },
                                    { label: 'This Week', value: `${weeklyStats.percentage}%`, icon: TrendingUp, color: weeklyStats.percentage >= 75 ? 'emerald' : 'amber' },
                                    { label: 'Safe', value: subjects.filter(s => getPercentage(s) >= s.targetPercentage).length, icon: CheckCircle2, color: 'emerald' },
                                    { label: 'At Risk', value: dangerSubjects.length, icon: AlertTriangle, color: 'rose' },
                                ].map((stat, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                        className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 text-center">
                                        <stat.icon size={18} className={`text-${stat.color}-400 mx-auto mb-2`} />
                                        <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                                        <p className="text-white/30 text-xs">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Subject Cards */}
                            {subjects.length === 0 ? (
                                <div className="bg-white/[0.03] rounded-2xl border border-dashed border-white/[0.08] p-16 text-center">
                                    <BookOpen size={48} className="text-white/10 mx-auto mb-4" />
                                    <p className="text-white/30 text-sm">Add your subjects to start tracking attendance</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {subjects.map((s, i) => {
                                        const pct = getPercentage(s);
                                        const color = getColor(pct, s.targetPercentage);
                                        const missable = canMiss(s);
                                        const needed = needToAttend(s);
                                        const isSelected = selectedSubjects.includes(s.id);

                                        return (
                                            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                className={`bg-white/[0.03] backdrop-blur-xl border rounded-2xl p-5 group relative overflow-hidden transition-all ${isSelected ? 'border-violet-500/50' : 'border-white/[0.06]'}`}>
                                                {/* Glow */}
                                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" style={{ backgroundColor: color + '15' }} />

                                                {/* Selection checkbox */}
                                                <button onClick={() => toggleSubjectSelection(s.id)}
                                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                                                    {isSelected ? <CheckSquare size={18} className="text-violet-400" /> : <Square size={18} className="text-white/30" />}
                                                </button>

                                                <div className="flex items-start gap-4 relative z-10">
                                                    {/* Progress Ring with streak */}
                                                    <div className="relative w-16 h-16 flex-shrink-0">
                                                        <svg className="w-16 h-16 -rotate-90">
                                                            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                                                            <motion.circle cx="32" cy="32" r="28" fill="none"
                                                                stroke={color} strokeWidth="5" strokeLinecap="round"
                                                                initial={{ strokeDasharray: '0 176' }}
                                                                animate={{ strokeDasharray: `${pct * 1.76} 176` }}
                                                                transition={{ duration: 1 }}
                                                            />
                                                        </svg>
                                                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{pct}%</span>
                                                        {s.streak > 0 && (
                                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                                                <span className="text-[10px] font-bold text-white">{s.streak}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-white/90 font-semibold text-sm">{s.name}</h3>
                                                                <p className="text-white/30 text-[10px]">{s.code} · {s.credits} credits</p>
                                                            </div>
                                                            <button onClick={() => deleteSubject(s.id)}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-white/20 hover:text-red-400 transition-all">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-white/50 text-xs">{s.attended}/{s.total} classes</span>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold`}
                                                                style={{ backgroundColor: color + '20', color }}>
                                                                {getStatusText(pct, s.targetPercentage)}
                                                            </span>
                                                        </div>

                                                        {/* Quick actions */}
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <button onClick={() => markPresent(s.id)}
                                                                className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/25 transition-all flex items-center gap-1">
                                                                <CheckCircle2 size={12} /> Present
                                                            </button>
                                                            <button onClick={() => markAbsent(s.id)}
                                                                className="px-3 py-1.5 bg-rose-500/15 text-rose-400 rounded-lg text-xs font-medium hover:bg-rose-500/25 transition-all flex items-center gap-1">
                                                                <AlertCircle size={12} /> Absent
                                                            </button>
                                                            <button onClick={() => undoLastMark(s.id)}
                                                                className="px-2 py-1.5 bg-white/[0.05] text-white/40 rounded-lg text-xs hover:text-white/60 transition-all" title="Undo last">
                                                                <RotateCcw size={12} />
                                                            </button>
                                                        </div>

                                                        {/* Predictions */}
                                                        <div className="mt-3 p-2 bg-black/20 rounded-lg">
                                                            {pct >= s.targetPercentage ? (
                                                                <p className="text-emerald-400/70 text-[11px] flex items-center gap-1">
                                                                    <Zap size={10} /> You can miss <b>{missable}</b> more classes safely
                                                                </p>
                                                            ) : (
                                                                <p className="text-rose-400/70 text-[11px] flex items-center gap-1">
                                                                    <AlertTriangle size={10} /> Attend <b>{needed}</b> more to reach {s.targetPercentage}%
                                                                </p>
                                                            )}
                                                            {s.longestStreak > 0 && (
                                                                <p className="text-orange-400/50 text-[10px] mt-1 flex items-center gap-1">
                                                                    <Flame size={10} /> Best streak: {s.longestStreak}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* HISTORY VIEW */}
                    {activeView === 'history' && (
                        <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <History size={18} className="text-violet-400" /> Attendance History
                                </h3>

                                {uniqueDates.length === 0 ? (
                                    <p className="text-white/30 text-center py-8">No attendance records yet</p>
                                ) : (
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                        {uniqueDates.map(date => (
                                            <div key={date} className="bg-white/[0.03] rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-white/60 text-sm font-medium">
                                                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span className="text-white/30 text-xs">
                                                        {subjects.filter(s => s.records.some(r => r.date === date && r.present)).length}/{subjects.length} present
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    {subjects.map(s => {
                                                        const morning = s.records.find(r => r.date === date && r.session === 'morning');
                                                        const afternoon = s.records.find(r => r.date === date && r.session === 'afternoon');

                                                        return (
                                                            <div key={s.id} className="bg-black/20 rounded-lg p-2 text-center">
                                                                <p className="text-white/50 text-[10px] mb-1">{s.code}</p>
                                                                <div className="flex justify-center gap-1">
                                                                    {morning && (
                                                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${morning.present ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                                            {morning.present ? '✓' : '✕'}
                                                                        </span>
                                                                    )}
                                                                    {afternoon && (
                                                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${afternoon.present ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                                            {afternoon.present ? '✓' : '✕'}
                                                                        </span>
                                                                    )}
                                                                    {!morning && !afternoon && (
                                                                        <span className="text-white/20 text-[8px]">—</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ANALYTICS VIEW */}
                    {activeView === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            {/* Achievement Cards */}
                            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Award size={18} className="text-amber-400" /> Achievements
                                    <span className="text-amber-400/60 text-sm ml-auto">{unlockedAchievements}/{achievements.length}</span>
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                    {achievements.map(a => (
                                        <div key={a.id} className={`p-3 rounded-xl text-center transition-all ${a.unlocked ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-white/[0.03] border border-white/[0.06] opacity-50'}`}>
                                            <span className="text-2xl">{a.icon}</span>
                                            <p className="text-white/80 text-xs font-medium mt-1">{a.name}</p>
                                            <p className="text-white/30 text-[10px]">{a.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Subject Analytics */}
                            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <LineChart size={18} className="text-cyan-400" /> Subject Analysis
                                </h3>
                                <div className="space-y-3">
                                    {subjects.map(s => {
                                        const pct = getPercentage(s);
                                        const color = getColor(pct, s.targetPercentage);

                                        return (
                                            <div key={s.id} className="bg-black/20 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="text-white/80 text-sm font-medium">{s.name}</h4>
                                                        <p className="text-white/30 text-[10px]">{s.code}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold" style={{ color }}>{pct}%</p>
                                                        <p className="text-white/30 text-[10px]">Target: {s.targetPercentage}%</p>
                                                    </div>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(pct, 100)}%` }}
                                                        transition={{ duration: 0.8 }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-2 text-[10px]">
                                                    <span className="text-white/30">Missable: {canMiss(s)}</span>
                                                    <span className="text-white/30">Needed: {needToAttend(s)}</span>
                                                </div>
                                                {/* Target slider */}
                                                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white/30 text-[10px]">Target:</span>
                                                        <input
                                                            type="range"
                                                            min="50"
                                                            max="100"
                                                            value={s.targetPercentage}
                                                            onChange={e => updateTarget(s.id, parseInt(e.target.value))}
                                                            className="flex-1 h-1 bg-white/[0.1] rounded-full appearance-none cursor-pointer"
                                                        />
                                                        <span className="text-white/50 text-xs w-8">{s.targetPercentage}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CGPA VIEW */}
                    {activeView === 'cgpa' && (
                        <motion.div key="cgpa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            {/* CGPA Display */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8 text-center">
                                <GraduationCap size={40} className="text-violet-400 mx-auto mb-4" />
                                <p className="text-white/40 text-sm mb-2">Your Current CGPA</p>
                                <p className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">{cgpa}</p>
                                <p className="text-white/30 text-xs mt-2">{subjects.length} subjects · {subjects.reduce((s, sub) => s + sub.credits, 0)} total credits</p>
                                <div className="flex justify-center gap-4 mt-6">
                                    <div className="px-4 py-2 bg-white/[0.05] rounded-xl">
                                        <p className="text-white/30 text-[10px] uppercase">Grade</p>
                                        <p className="text-lg font-bold text-emerald-400">
                                            {cgpa >= 9 ? 'S' : cgpa >= 8 ? 'A' : cgpa >= 7 ? 'B' : cgpa >= 6 ? 'C' : cgpa >= 5 ? 'D' : 'F'}
                                        </p>
                                    </div>
                                    <div className="px-4 py-2 bg-white/[0.05] rounded-xl">
                                        <p className="text-white/30 text-[10px] uppercase">Percentile</p>
                                        <p className="text-lg font-bold text-cyan-400">{Math.round(cgpa * 10)}%</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Grade Assignment */}
                            {subjects.length === 0 ? (
                                <div className="bg-white/[0.03] rounded-2xl border border-dashed border-white/[0.08] p-12 text-center">
                                    <Calculator size={48} className="text-white/10 mx-auto mb-4" />
                                    <p className="text-white/30 text-sm">Add subjects to calculate your CGPA</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Assign Grades</h3>
                                    {subjects.map((s, i) => {
                                        const gradePoint = GRADES.find(g => g.grade === s.grade)?.points || 0;
                                        return (
                                            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
                                                <div className="flex-1">
                                                    <h4 className="text-white/80 text-sm font-medium">{s.name}</h4>
                                                    <p className="text-white/30 text-[10px]">{s.code} · {s.credits} credits · GP: {gradePoint}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    {GRADES.map(g => (
                                                        <button key={g.grade} onClick={() => updateGrade(s.id, g.grade)}
                                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${s.grade === g.grade
                                                                ? 'bg-violet-500/30 text-violet-400 border border-violet-500/50'
                                                                : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:bg-white/[0.06]'}`}>
                                                            {g.grade}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Grade Scale Reference */}
                            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                                <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">VIT Grade Scale</h3>
                                <div className="grid grid-cols-7 gap-2">
                                    {GRADES.map(g => (
                                        <div key={g.grade} className="p-3 bg-white/[0.03] rounded-xl text-center border border-white/[0.05]">
                                            <p className="text-lg font-bold text-violet-400">{g.grade}</p>
                                            <p className="text-white/30 text-[10px]">{g.points} pts</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
