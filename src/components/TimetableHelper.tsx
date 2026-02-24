'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, Upload, CheckCircle, AlertCircle, BookOpen,
    MapPin, User, ChevronRight, Trash2, Download, RefreshCw,
    Search, Filter, Plus, X, Bell, Info, GraduationCap,
    Timer, ArrowRight, LayoutGrid, List, Star, Zap, Settings,
    Volume2, VolumeX, MoreVertical, Edit2, Copy, Share2
} from 'lucide-react';

// VIT Timetable Slot Definitions
interface TimeSlot {
    code: string;
    startTime: string;
    endTime: string;
    type: 'THEORY' | 'LAB';
}

interface Course {
    id: string;
    code: string;
    name: string;
    faculty: string;
    room: string;
    slot: string;
    type: 'THEORY' | 'LAB';
    credits?: number;
    color?: string;
}

interface DaySchedule {
    day: string;
    slots: { slot: TimeSlot; course?: Course }[];
}

interface TimetableData {
    courses: Course[];
    schedule: DaySchedule[];
}

interface CurrentClass {
    course?: Course;
    slot?: TimeSlot;
    nextCourse?: Course;
    nextSlot?: TimeSlot;
    timeRemaining: number;
    isBreak: boolean;
    isWeekend: boolean;
}

// VIT Standard Slots
const THEORY_SLOTS: TimeSlot[] = [
    { code: 'A1', startTime: '08:00', endTime: '08:50', type: 'THEORY' },
    { code: 'F1', startTime: '09:00', endTime: '09:50', type: 'THEORY' },
    { code: 'D1', startTime: '10:00', endTime: '10:50', type: 'THEORY' },
    { code: 'TB1', startTime: '11:00', endTime: '11:50', type: 'THEORY' },
    { code: 'TG1', startTime: '12:00', endTime: '12:50', type: 'THEORY' },
    { code: 'A2', startTime: '14:00', endTime: '14:50', type: 'THEORY' },
    { code: 'F2', startTime: '15:00', endTime: '15:50', type: 'THEORY' },
    { code: 'D2', startTime: '16:00', endTime: '16:50', type: 'THEORY' },
    { code: 'TB2', startTime: '17:00', endTime: '17:50', type: 'THEORY' },
    { code: 'TG2', startTime: '18:00', endTime: '18:50', type: 'THEORY' },
    { code: 'B1', startTime: '08:00', endTime: '08:50', type: 'THEORY' },
    { code: 'G1', startTime: '09:00', endTime: '09:50', type: 'THEORY' },
    { code: 'E1', startTime: '10:00', endTime: '10:50', type: 'THEORY' },
    { code: 'TC1', startTime: '11:00', endTime: '11:50', type: 'THEORY' },
    { code: 'TAA1', startTime: '12:00', endTime: '12:50', type: 'THEORY' },
    { code: 'B2', startTime: '14:00', endTime: '14:50', type: 'THEORY' },
    { code: 'G2', startTime: '15:00', endTime: '15:50', type: 'THEORY' },
    { code: 'E2', startTime: '16:00', endTime: '16:50', type: 'THEORY' },
    { code: 'TC2', startTime: '17:00', endTime: '17:50', type: 'THEORY' },
    { code: 'TAA2', startTime: '18:00', endTime: '18:50', type: 'THEORY' },
    { code: 'C1', startTime: '08:00', endTime: '08:50', type: 'THEORY' },
    { code: 'TD1', startTime: '09:00', endTime: '09:50', type: 'THEORY' },
    { code: 'TBB1', startTime: '10:00', endTime: '10:50', type: 'THEORY' },
    { code: 'C2', startTime: '14:00', endTime: '14:50', type: 'THEORY' },
    { code: 'TD2', startTime: '15:00', endTime: '15:50', type: 'THEORY' },
    { code: 'TBB2', startTime: '16:00', endTime: '16:50', type: 'THEORY' },
];

const LAB_SLOTS: TimeSlot[] = [
    { code: 'L1', startTime: '08:00', endTime: '09:40', type: 'LAB' },
    { code: 'L31', startTime: '14:00', endTime: '15:40', type: 'LAB' },
    { code: 'L32', startTime: '14:50', endTime: '16:30', type: 'LAB' },
    { code: 'L33', startTime: '15:50', endTime: '17:30', type: 'LAB' },
];

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Slot mapping for each day
const DAY_SLOTS: Record<string, string[]> = {
    'MON': ['A1', 'F1', 'D1', 'TB1', 'TG1', 'A2', 'F2', 'D2', 'TB2', 'TG2'],
    'TUE': ['B1', 'G1', 'E1', 'TC1', 'TAA1', 'B2', 'G2', 'E2', 'TC2', 'TAA2'],
    'WED': ['C1', 'A1', 'F1', 'TD1', 'TBB1', 'C2', 'A2', 'F2', 'TD2', 'TBB2'],
    'THU': ['D1', 'B1', 'G1', 'TE1', 'TCC1', 'D2', 'B2', 'G2', 'TE2', 'TCC2'],
    'FRI': ['E1', 'C1', 'TA1', 'TF1', 'TDD1', 'E2', 'C2', 'TA2', 'TF2', 'TDD2'],
    'SAT': ['X11', 'X12', 'Y11', 'Y12', 'S8', 'X21', 'Z21', 'Y21', 'W21', 'W22'],
};

// Course colors
const COURSE_COLORS = [
    'from-cyan-500/30 to-blue-500/20',
    'from-violet-500/30 to-purple-500/20',
    'from-emerald-500/30 to-teal-500/20',
    'from-amber-500/30 to-orange-500/20',
    'from-rose-500/30 to-pink-500/20',
    'from-indigo-500/30 to-violet-500/20',
];

export default function TimetableHelper() {
    const [timetable, setTimetable] = useState<TimetableData | null>(null);
    const [activeTab, setActiveTab] = useState<'current' | 'timetable' | 'ffcs' | 'stats'>('current');
    const [currentClass, setCurrentClass] = useState<CurrentClass | null>(null);
    const [uploadText, setUploadText] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [selectedDay, setSelectedDay] = useState(() => {
        const day = new Date().getDay();
        return day === 0 ? 1 : day;
    });
    const [ffcsQuery, setFfcsQuery] = useState('');
    const [conflicts, setConflicts] = useState<string[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [newCourse, setNewCourse] = useState({ name: '', code: '', faculty: '', room: '', type: 'THEORY' as const });
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [viewMode, setViewMode] = useState<'week' | 'day'>('day');

    // Load timetable from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('vitgroww_timetable');
        if (saved) {
            try {
                setTimetable(JSON.parse(saved));
            } catch { }
        }
    }, []);

    // Save timetable when changed
    useEffect(() => {
        if (timetable) {
            localStorage.setItem('vitgroww_timetable', JSON.stringify(timetable));
        }
    }, [timetable]);

    // Parse timetable from uploaded text
    const parseTimetable = useCallback((text: string): TimetableData => {
        const courses: Course[] = [];
        const lines = text.split('\n').filter(l => l.trim());

        const coursePattern = /([A-Z]\d+)-([A-Z]+\d+)-(ETH|ELA|LO|LAB)-([A-Z0-9]+)-(\d+)-ALL/gi;
        let colorIndex = 0;

        lines.forEach(line => {
            let match;
            while ((match = coursePattern.exec(line)) !== null) {
                const [_, slot, code, type, building, room] = match;
                courses.push({
                    id: `course-${Date.now()}-${Math.random()}`,
                    code: code.toUpperCase(),
                    name: code.toUpperCase(),
                    faculty: 'TBD',
                    room: `${building}-${room}`,
                    slot: slot.toUpperCase(),
                    type: type === 'ETH' ? 'THEORY' : 'LAB',
                    color: COURSE_COLORS[colorIndex % COURSE_COLORS.length]
                });
                colorIndex++;
            }
        });

        const schedule: DaySchedule[] = DAYS.map(day => {
            const daySlots = DAY_SLOTS[day] || [];
            const slots = daySlots.map(slotCode => {
                const course = courses.find(c => c.slot === slotCode);
                const slot = [...THEORY_SLOTS, ...LAB_SLOTS].find(s => s.code === slotCode);
                return { slot: slot || { code: slotCode, startTime: '', endTime: '', type: 'THEORY' as const }, course };
            }).filter(s => s.slot);
            return { day, slots };
        });

        return { courses, schedule };
    }, []);

    const handleUpload = () => {
        if (!uploadText.trim()) return;
        const parsed = parseTimetable(uploadText);
        setTimetable(parsed);
        setShowUpload(false);
        setUploadText('');
    };

    const addCourse = () => {
        if (!timetable || !newCourse.name || !selectedSlot) return;

        const course: Course = {
            id: `course-${Date.now()}`,
            code: newCourse.code || `NEW${timetable.courses.length + 1}`,
            name: newCourse.name,
            faculty: newCourse.faculty || 'TBD',
            room: newCourse.room || 'TBD',
            slot: selectedSlot.code,
            type: selectedSlot.type,
            color: COURSE_COLORS[timetable.courses.length % COURSE_COLORS.length]
        };

        setTimetable({
            ...timetable,
            courses: [...timetable.courses, course]
        });

        setShowAddModal(false);
        setNewCourse({ name: '', code: '', faculty: '', room: '', type: 'THEORY' });
        setSelectedSlot(null);
    };

    const removeCourse = (courseId: string) => {
        if (!timetable) return;
        setTimetable({
            ...timetable,
            courses: timetable.courses.filter(c => c.id !== courseId)
        });
    };

    // Get current class info
    const updateCurrentClass = useCallback(() => {
        if (!timetable) return;

        const now = new Date();
        const dayIndex = now.getDay();

        if (dayIndex === 0) {
            setCurrentClass({ timeRemaining: 0, isBreak: true, isWeekend: true });
            return;
        }

        const dayName = DAYS[dayIndex - 1];
        const daySchedule = timetable.schedule.find(s => s.day === dayName);
        if (!daySchedule) {
            setCurrentClass({ timeRemaining: 0, isBreak: true, isWeekend: false });
            return;
        }

        const currentTime = now.getHours() * 60 + now.getMinutes();

        let current: CurrentClass = { timeRemaining: 0, isBreak: true, isWeekend: false };

        for (let i = 0; i < daySchedule.slots.length; i++) {
            const { slot, course } = daySchedule.slots[i];
            if (!slot.startTime) continue;

            const [startH, startM] = slot.startTime.split(':').map(Number);
            const [endH, endM] = slot.endTime.split(':').map(Number);
            const slotStart = startH * 60 + startM;
            const slotEnd = endH * 60 + endM;

            if (currentTime >= slotStart && currentTime < slotEnd) {
                current = {
                    course,
                    slot,
                    timeRemaining: slotEnd - currentTime,
                    isBreak: !course,
                    isWeekend: false
                };

                for (let j = i + 1; j < daySchedule.slots.length; j++) {
                    if (daySchedule.slots[j].course) {
                        current.nextCourse = daySchedule.slots[j].course;
                        current.nextSlot = daySchedule.slots[j].slot;
                        break;
                    }
                }
                break;
            } else if (currentTime < slotStart) {
                if (!current.nextCourse && course) {
                    current.nextCourse = course;
                    current.nextSlot = slot;
                    current.timeRemaining = slotStart - currentTime;
                }
                break;
            }
        }

        setCurrentClass(current);
    }, [timetable]);

    useEffect(() => {
        updateCurrentClass();
        const interval = setInterval(updateCurrentClass, 60000);
        return () => clearInterval(interval);
    }, [updateCurrentClass]);

    // FFCS Helper
    const checkConflicts = (newSlot: string) => {
        if (!timetable) return [];
        const conflicts: string[] = [];
        timetable.courses.forEach(course => {
            if (course.slot === newSlot) {
                conflicts.push(`${course.code} already occupies ${newSlot}`);
            }
        });
        return conflicts;
    };

    const getFreeSlots = (day: string) => {
        const daySlots = DAY_SLOTS[day] || [];
        const occupied = timetable?.courses.map(c => c.slot) || [];
        return daySlots.filter(s => !occupied.includes(s));
    };

    const formatTime = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    // Stats calculations
    const stats = useCallback(() => {
        if (!timetable) return { theory: 0, labs: 0, totalCredits: 0, freeDays: 0 };

        const theory = timetable.courses.filter(c => c.type === 'THEORY').length;
        const labs = timetable.courses.filter(c => c.type === 'LAB').length;
        const totalCredits = timetable.courses.reduce((sum, c) => sum + (c.credits || (c.type === 'LAB' ? 2 : 3)), 0);

        let freeDays = 0;
        DAYS.forEach(day => {
            const daySchedule = timetable.schedule.find(s => s.day === day);
            const hasClasses = daySchedule?.slots.some(s => s.course);
            if (!hasClasses) freeDays++;
        });

        return { theory, labs, totalCredits, freeDays };
    }, [timetable]);

    const currentStats = stats();

    if (!timetable && !showUpload) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Hero */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-2xl p-6 border border-white/[0.06]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                            <Calendar size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Timetable Helper</h2>
                            <p className="text-white/40 text-sm">Manage your VIT schedule & track classes</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                    >
                        <Upload size={16} /> Upload Timetable
                    </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Clock, title: 'Live Tracker', desc: 'Real-time class updates', color: 'cyan' },
                        { icon: Search, title: 'FFCS Helper', desc: 'Slot availability checker', color: 'violet' },
                        { icon: Bell, title: 'Reminders', desc: 'Never miss a class', color: 'amber' },
                    ].map((f, i) => (
                        <div key={i} className="bg-[#0c0f17] rounded-xl p-4 border border-white/[0.05]">
                            <div className={`w-9 h-9 rounded-lg bg-${f.color}-500/15 flex items-center justify-center mb-2`}>
                                <f.icon size={18} className={`text-${f.color}-400`} />
                            </div>
                            <h3 className="text-white/80 font-medium text-sm mb-0.5">{f.title}</h3>
                            <p className="text-white/30 text-xs">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    if (showUpload) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                <div className="bg-[#0c0f17] rounded-2xl p-5 border border-white/[0.05]">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Upload size={18} className="text-cyan-400" /> Upload Timetable
                    </h3>
                    <p className="text-white/40 text-sm mb-4">
                        Paste your timetable data. Format: <span className="text-cyan-400">A1-BACSE105-ETH-AB1-401-ALL</span>
                    </p>
                    <textarea
                        value={uploadText}
                        onChange={(e) => setUploadText(e.target.value)}
                        placeholder="Paste timetable data..."
                        className="w-full h-48 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 resize-none mb-3"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpload}
                            disabled={!uploadText.trim()}
                            className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-30"
                        >
                            Parse
                        </button>
                        <button
                            onClick={() => setShowUpload(false)}
                            className="px-5 py-2.5 bg-white/[0.05] text-white/60 rounded-xl"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Calendar size={22} className="text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Timetable</h2>
                        <p className="text-white/40 text-xs">{timetable?.courses.length || 0} courses · {currentStats.totalCredits} credits</p>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2.5 rounded-xl text-xs transition-colors border ${soundEnabled ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/[0.05] border-white/[0.06] text-white/40'}`}
                    >
                        {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowUpload(true)}
                        className="p-2.5 bg-white/[0.05] text-white/50 rounded-xl text-xs hover:bg-white/[0.08] border border-white/[0.06]"
                    >
                        <Upload size={14} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setTimetable(null)}
                        className="p-2.5 bg-white/[0.05] text-rose-400/60 rounded-xl text-xs hover:bg-rose-500/10 border border-white/[0.06]"
                    >
                        <Trash2 size={14} />
                    </motion.button>
                </div>
            </div>

            {/* Tabs with sliding indicator */}
            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-xl w-fit flex-shrink-0 border border-white/[0.05]">
                {[
                    { id: 'current', label: 'Now', icon: Clock },
                    { id: 'timetable', label: 'Schedule', icon: LayoutGrid },
                    { id: 'ffcs', label: 'FFCS', icon: Search },
                    { id: 'stats', label: 'Stats', icon: Star },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === tab.id ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
                    >
                        {activeTab === tab.id && (
                            <motion.div layoutId="ttTab" className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg border border-cyan-500/20" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5"><tab.icon size={12} /> {tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                <AnimatePresence mode="wait">
                    {/* CURRENT CLASS VIEW */}
                    {activeTab === 'current' && (
                        <motion.div key="current" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                            {/* Current Class Card */}
                            <div className="bg-[#0c0e18] rounded-2xl p-5 border border-white/[0.06] overflow-hidden relative">
                                {/* Ambient glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                                {currentClass?.course ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold rounded-lg flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                                                </span>
                                                <span className="text-white/25 text-[10px]">{currentClass.slot?.code} · {currentClass.slot?.startTime}–{currentClass.slot?.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] rounded-lg">
                                                <Timer size={11} className="text-cyan-400" />
                                                <span className="text-white font-mono text-xs font-bold">{formatTime(currentClass.timeRemaining)}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-0.5">{currentClass.course.name}</h3>
                                        <p className="text-cyan-400 text-sm font-medium mb-4">{currentClass.course.code}</p>
                                        <div className="flex items-center gap-4 text-xs mb-4">
                                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.03] rounded-lg text-white/60">
                                                <MapPin size={12} className="text-cyan-400" /> {currentClass.course.room}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.03] rounded-lg text-white/60">
                                                <User size={12} className="text-violet-400" /> {currentClass.course.faculty}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full shadow-lg shadow-cyan-500/30"
                                                initial={{ width: '100%' }}
                                                animate={{ width: `${Math.min(100, (currentClass.timeRemaining / 50) * 100)}%` }}
                                                transition={{ duration: 60, ease: 'linear' }}
                                            />
                                        </div>
                                    </div>
                                ) : currentClass?.isWeekend ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 flex items-center justify-center mx-auto mb-3">
                                            <span className="text-3xl">🎉</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">Weekend!</h3>
                                        <p className="text-white/40 text-sm">No classes today. Enjoy your break!</p>
                                    </div>
                                ) : currentClass?.isBreak ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                                            <Clock size={28} className="text-white/20" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">Free Period</h3>
                                        {currentClass.nextCourse && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.04] inline-block">
                                                <p className="text-white/40 text-xs">Next up: <span className="text-white/70 font-medium">{currentClass.nextCourse.name}</span></p>
                                                <p className="text-cyan-400 text-xs font-medium mt-0.5">in {formatTime(currentClass.timeRemaining)}</p>
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3"><span className="text-3xl">✅</span></div>
                                        <p className="text-white/50 font-medium">All done for today!</p>
                                    </div>
                                )}
                            </div>

                            {/* Today's Quick View */}
                            <div className="bg-[#0c0f17] rounded-xl p-4 border border-white/[0.05]">
                                <h3 className="text-sm font-semibold text-white mb-3">Today's Classes</h3>
                                <div className="space-y-2">
                                    {timetable?.schedule[selectedDay - 1]?.slots.filter(s => s.course).slice(0, 4).map(({ slot, course }, i) => {
                                        const now = new Date();
                                        const currentTime = now.getHours() * 60 + now.getMinutes();
                                        const [startH, startM] = slot.startTime.split(':').map(Number);
                                        const slotTime = startH * 60 + startM;
                                        const isPast = currentTime > slotTime + 50;
                                        const isCurrent = currentTime >= slotTime && currentTime < slotTime + 50;

                                        return (
                                            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${isCurrent ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.02]'}`}>
                                                <div className="w-12 text-center">
                                                    <p className={`text-xs font-medium ${isCurrent ? 'text-cyan-400' : 'text-white/40'}`}>{slot.code}</p>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-white' : 'text-white/70'}`}>{course?.name}</p>
                                                    <p className="text-[10px] text-white/40">{course?.room}</p>
                                                </div>
                                                {isCurrent && <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] rounded">Now</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* WEEKLY VIEW */}
                    {activeTab === 'timetable' && (
                        <motion.div key="timetable" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                            {/* Day Selector */}
                            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                                {DAYS.map((day, i) => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(i + 1)}
                                        className={`relative flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${selectedDay === i + 1 ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
                                    >
                                        {selectedDay === i + 1 && (
                                            <motion.div layoutId="dayTab" className="absolute inset-0 bg-cyan-500/15 rounded-lg border border-cyan-500/20" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                                        )}
                                        <span className="relative z-10">{day}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Day Schedule */}
                            <div className="bg-[#0c0f17] rounded-xl p-4 border border-white/[0.05]">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-white">{DAY_NAMES[selectedDay - 1]}</h3>
                                    <span className="text-white/30 text-xs">
                                        {timetable?.schedule[selectedDay - 1]?.slots.filter(s => s.course).length || 0} classes
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {timetable?.schedule[selectedDay - 1]?.slots.map(({ slot, course }, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-3 p-3 rounded-xl ${course ? 'bg-gradient-to-r ' + course.color : 'bg-white/[0.01]'
                                                }`}
                                        >
                                            <div className="w-14 text-center">
                                                <p className={`text-xs font-medium ${course ? 'text-cyan-400' : 'text-white/20'}`}>{slot.code}</p>
                                                <p className="text-[9px] text-white/30">{slot.startTime}</p>
                                            </div>
                                            {course ? (
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-white truncate">{course.name}</p>
                                                        <button
                                                            onClick={() => removeCourse(course.id)}
                                                            className="text-white/30 hover:text-rose-400"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                                                        <span>{course.code}</span>
                                                        <span>•</span>
                                                        <span>{course.room}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedSlot(slot);
                                                        setShowAddModal(true);
                                                    }}
                                                    className="flex-1 flex items-center justify-between text-white/30 hover:text-cyan-400 text-sm"
                                                >
                                                    <span>Free Slot</span>
                                                    <Plus size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Course List */}
                            <div className="bg-[#0c0f17] rounded-xl p-4 border border-white/[0.05]">
                                <h3 className="text-sm font-semibold text-white mb-3">Your Courses</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {timetable?.courses.map((course) => (
                                        <div key={course.id} className="p-2.5 bg-white/[0.02] rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <p className="text-white/80 text-xs font-medium truncate">{course.name}</p>
                                                <span className={`text-[8px] px-1 py-0.5 rounded ${course.type === 'THEORY' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                                    {course.type === 'THEORY' ? 'TH' : 'LAB'}
                                                </span>
                                            </div>
                                            <p className="text-white/40 text-[10px] mt-1">{course.slot}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* FFCS HELPER */}
                    {activeTab === 'ffcs' && (
                        <motion.div key="ffcs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                            {/* Slot Checker */}
                            <div className="bg-[#0c0f17] rounded-xl p-4 border border-white/[0.05]">
                                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Search size={14} className="text-violet-400" /> Check Slot
                                </h3>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={ffcsQuery}
                                        onChange={(e) => setFfcsQuery(e.target.value.toUpperCase())}
                                        placeholder="Enter slot (e.g., A1)"
                                        className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white"
                                    />
                                    <button
                                        onClick={() => setConflicts(checkConflicts(ffcsQuery))}
                                        className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg text-sm"
                                    >
                                        Check
                                    </button>
                                </div>
                                {conflicts.length > 0 ? (
                                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                        <p className="text-rose-400 text-xs font-medium flex items-center gap-1">
                                            <AlertCircle size={12} /> Conflict!
                                        </p>
                                        <p className="text-white/50 text-xs mt-1">{conflicts[0]}</p>
                                    </div>
                                ) : ffcsQuery && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                        <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                                            <CheckCircle size={12} /> Available!
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Free Slots */}
                            <div className="bg-[#0c0f17] rounded-xl p-4 border border-white/[0.05]">
                                <h3 className="text-sm font-semibold text-white mb-3">Free Slots</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {DAYS.slice(0, 5).map(day => {
                                        const free = getFreeSlots(day);
                                        return (
                                            <div key={day} className="p-2.5 bg-white/[0.02] rounded-lg">
                                                <p className="text-white/60 text-xs font-medium mb-1.5">{day}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {free.slice(0, 6).map(slot => (
                                                        <span key={slot} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded">
                                                            {slot}
                                                        </span>
                                                    ))}
                                                    {free.length > 6 && <span className="text-white/30 text-[10px]">+{free.length - 6}</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                    <Star size={14} className="text-amber-400" /> Tips
                                </h3>
                                <ul className="space-y-1">
                                    {['Check conflicts before registering', 'Keep backup options ready', 'Lab slots are 2-hour blocks'].map((tip, i) => (
                                        <li key={i} className="text-white/50 text-xs flex items-center gap-2">
                                            <span className="text-amber-400">•</span> {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {/* STATS VIEW */}
                    {activeTab === 'stats' && (
                        <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-xl p-4 border border-cyan-500/20">
                                    <p className="text-cyan-400 text-2xl font-black">{currentStats.theory}</p>
                                    <p className="text-white/50 text-xs">Theory Classes</p>
                                </div>
                                <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                                    <p className="text-amber-400 text-2xl font-black">{currentStats.labs}</p>
                                    <p className="text-white/50 text-xs">Lab Sessions</p>
                                </div>
                                <div className="bg-gradient-to-br from-violet-500/20 to-violet-500/5 rounded-xl p-4 border border-violet-500/20">
                                    <p className="text-violet-400 text-2xl font-black">{currentStats.totalCredits}</p>
                                    <p className="text-white/50 text-xs">Total Credits</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                                    <p className="text-emerald-400 text-2xl font-black">{currentStats.freeDays}</p>
                                    <p className="text-white/50 text-xs">Free Days</p>
                                </div>
                            </div>

                            {/* Weekly Overview */}
                            <div className="bg-[#0c0f17] rounded-xl p-4 border border-white/[0.05]">
                                <h3 className="text-sm font-semibold text-white mb-3">Weekly Overview</h3>
                                <div className="flex justify-between gap-1">
                                    {DAYS.map((day, i) => {
                                        const daySchedule = timetable?.schedule[i];
                                        const hasClasses = daySchedule?.slots.some(s => s.course);
                                        const classCount = daySchedule?.slots.filter(s => s.course).length || 0;

                                        return (
                                            <div key={day} className="flex-1 text-center">
                                                <div className={`h-16 rounded-lg flex items-end justify-center pb-1 mb-1 ${hasClasses ? 'bg-gradient-to-t from-cyan-500/30 to-transparent' : 'bg-white/[0.02]'}`}>
                                                    <span className="text-white/60 text-xs font-medium">{classCount}</span>
                                                </div>
                                                <p className="text-white/30 text-[10px]">{day}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Course Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a12] border border-white/[0.1] rounded-2xl w-full max-w-sm p-5"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Add Course</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                    placeholder="Course Name"
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white"
                                />
                                <input
                                    type="text"
                                    value={newCourse.code}
                                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                                    placeholder="Course Code (e.g., CSE1001)"
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white"
                                />
                                <input
                                    type="text"
                                    value={newCourse.faculty}
                                    onChange={(e) => setNewCourse({ ...newCourse, faculty: e.target.value })}
                                    placeholder="Faculty Name"
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white"
                                />
                                <input
                                    type="text"
                                    value={newCourse.room}
                                    onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
                                    placeholder="Room (e.g., AB-301)"
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white"
                                />
                                {selectedSlot && (
                                    <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                        <p className="text-cyan-400 text-xs">Slot: {selectedSlot.code} ({selectedSlot.startTime}-{selectedSlot.endTime})</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={addCourse}
                                    disabled={!newCourse.name}
                                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium rounded-lg disabled:opacity-30"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2.5 bg-white/[0.05] text-white/60 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
