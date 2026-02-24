'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Calendar,
    Clock,
    BookOpen,
    AlertTriangle,
    CheckCircle,
    Bell,
    BellOff,
    X
} from 'lucide-react';

interface Exam {
    id: string;
    subject: string;
    date: Date;
    time: string;
    venue: string;
    type: 'Midterm' | 'Final' | 'Quiz' | 'Practical';
    notes: string;
    notified: boolean;
}

const examTypes = [
    { value: 'Midterm', color: 'from-amber-500 to-orange-500', text: 'amber' },
    { value: 'Final', color: 'from-rose-500 to-red-500', text: 'rose' },
    { value: 'Quiz', color: 'from-cyan-500 to-blue-500', text: 'cyan' },
    { value: 'Practical', color: 'from-emerald-500 to-teal-500', text: 'emerald' },
];

export default function ExamCountdown() {
    const [exams, setExams] = useState<Exam[]>([
        {
            id: '1',
            subject: 'Data Structures & Algorithms',
            date: new Date('2026-03-15'),
            time: '09:00 AM',
            venue: 'AB-102',
            type: 'Midterm',
            notes: 'Chapters 1-8, focus on trees and graphs',
            notified: false,
        },
        {
            id: '2',
            subject: 'Machine Learning',
            date: new Date('2026-03-20'),
            time: '02:00 PM',
            venue: 'CD-205',
            type: 'Midterm',
            notes: 'Linear regression, classification, neural networks',
            notified: false,
        },
        {
            id: '3',
            subject: 'Database Management',
            date: new Date('2026-03-25'),
            time: '10:30 AM',
            venue: 'EF-301',
            type: 'Quiz',
            notes: 'SQL queries, normalization',
            notified: false,
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newExam, setNewExam] = useState({
        subject: '',
        date: '',
        time: '',
        venue: '',
        type: 'Midterm' as Exam['type'],
        notes: '',
    });

    const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const updateCountdowns = () => {
            const now = new Date();
            const newCountdowns: { [key: string]: string } = {};

            exams.forEach(exam => {
                const examDateTime = new Date(`${exam.date.toISOString().split('T')[0]}T${exam.time}`);
                const diff = examDateTime.getTime() - now.getTime();

                if (diff <= 0) {
                    newCountdowns[exam.id] = 'Completed';
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                    if (days > 0) {
                        newCountdowns[exam.id] = `${days}d ${hours}h`;
                    } else if (hours > 0) {
                        newCountdowns[exam.id] = `${hours}h ${minutes}m`;
                    } else {
                        newCountdowns[exam.id] = `${minutes}m`;
                    }
                }
            });

            setCountdowns(newCountdowns);
        };

        updateCountdowns();
        const interval = setInterval(updateCountdowns, 60000);
        return () => clearInterval(interval);
    }, [exams]);

    const addExam = () => {
        if (!newExam.subject || !newExam.date || !newExam.time) return;

        const exam: Exam = {
            id: Date.now().toString(),
            subject: newExam.subject,
            date: new Date(newExam.date),
            time: newExam.time,
            venue: newExam.venue,
            type: newExam.type,
            notes: newExam.notes,
            notified: false,
        };

        setExams([...exams, exam]);
        setNewExam({ subject: '', date: '', time: '', venue: '', type: 'Midterm', notes: '' });
        setShowModal(false);
    };

    const deleteExam = (id: string) => {
        setExams(exams.filter(e => e.id !== id));
    };

    const toggleNotification = (id: string) => {
        setExams(exams.map(e => e.id === id ? { ...e, notified: !e.notified } : e));
    };

    const getTypeStyle = (type: string) => {
        return examTypes.find(t => t.value === type) || examTypes[0];
    };

    const sortedExams = [...exams].sort((a, b) => a.date.getTime() - b.date.getTime());

    const upcomingExams = sortedExams.filter(e => new Date(e.date) >= new Date());
    const completedExams = sortedExams.filter(e => new Date(e.date) < new Date());

    const daysUntilNext = upcomingExams.length > 0
        ? Math.ceil((new Date(upcomingExams[0].date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white/90">Exam Countdown</h2>
                    <p className="text-sm text-white/40">Track your upcoming examinations</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Exam</span>
                </button>
            </div>

            {upcomingExams.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-indigo-600/20 border border-violet-500/20 p-8"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/50 mb-2">Next Exam In</p>
                            <p className="text-5xl font-bold text-white mb-2">
                                {daysUntilNext === 0 ? 'Today!' : daysUntilNext === 1 ? 'Tomorrow!' : `${daysUntilNext} Days`}
                            </p>
                            <p className="text-lg text-white/70">{upcomingExams[0].subject}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {upcomingExams[0].time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen size={14} />
                                    {upcomingExams[0].venue}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`inline-block px-4 py-2 rounded-xl bg-gradient-to-r ${getTypeStyle(upcomingExams[0].type).color}`}>
                                <span className="text-white font-medium">{upcomingExams[0].type}</span>
                            </div>
                            <p className="text-sm text-white/40 mt-3">
                                {upcomingExams[0].date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Calendar size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white/90">{upcomingExams.filter(e => e.type === 'Midterm').length}</p>
                            <p className="text-xs text-white/40">Midterms</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                            <AlertTriangle size={20} className="text-rose-400" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white/90">{upcomingExams.filter(e => e.type === 'Final').length}</p>
                            <p className="text-xs text-white/40">Finals</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                            <CheckCircle size={20} className="text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white/90">{upcomingExams.filter(e => e.type === 'Quiz').length}</p>
                            <p className="text-xs text-white/40">Quizzes</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Clock size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white/90">{completedExams.length}</p>
                            <p className="text-xs text-white/40">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white/80">Upcoming Exams</h3>
                <AnimatePresence>
                    {upcomingExams.map((exam, index) => {
                        const typeStyle = getTypeStyle(exam.type);
                        const countdown = countdowns[exam.id];
                        const isUrgent = daysUntilNext <= 3;

                        return (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group bg-white/[0.03] backdrop-blur-xl border rounded-2xl p-5 hover:border-white/10 transition-all ${isUrgent ? 'border-rose-500/30' : 'border-white/[0.06]'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${typeStyle.color} flex flex-col items-center justify-center`}>
                                        <span className="text-xs text-white/80">{exam.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-xl font-bold text-white">{exam.date.getDate()}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-base font-bold text-white/90 truncate">{exam.subject}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white/70`}>
                                                {exam.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-white/40">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {exam.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BookOpen size={12} />
                                                {exam.venue}
                                            </span>
                                        </div>
                                        {exam.notes && (
                                            <p className="text-xs text-white/30 mt-1 truncate">{exam.notes}</p>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${isUrgent ? 'text-rose-400' : 'text-cyan-400'}`}>
                                            {countdown}
                                        </div>
                                        <p className="text-xs text-white/40">remaining</p>
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => toggleNotification(exam.id)}
                                            className={`p-2 rounded-xl transition-colors ${exam.notified
                                                    ? 'bg-cyan-500/20 text-cyan-400'
                                                    : 'bg-white/[0.05] text-white/40 hover:text-white/70'
                                                }`}
                                        >
                                            {exam.notified ? <Bell size={16} /> : <BellOff size={16} />}
                                        </button>
                                        <button
                                            onClick={() => deleteExam(exam.id)}
                                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {upcomingExams.length === 0 && (
                    <div className="text-center py-12 text-white/30">
                        <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No upcoming exams</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-white/40 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-bold text-white/90 mb-6">Add New Exam</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/50 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Data Structures"
                                        value={newExam.subject}
                                        onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={newExam.date}
                                            onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 focus:outline-none focus:border-cyan-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Time</label>
                                        <input
                                            type="time"
                                            value={newExam.time}
                                            onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 focus:outline-none focus:border-cyan-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Venue</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., AB-102"
                                            value={newExam.venue}
                                            onChange={(e) => setNewExam({ ...newExam, venue: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Type</label>
                                        <select
                                            value={newExam.type}
                                            onChange={(e) => setNewExam({ ...newExam, type: e.target.value as Exam['type'] })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 focus:outline-none focus:border-cyan-500/50"
                                        >
                                            {examTypes.map(type => (
                                                <option key={type.value} value={type.value} className="bg-slate-900">{type.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/50 mb-2">Notes</label>
                                    <textarea
                                        placeholder="Topics to cover, important chapters..."
                                        value={newExam.notes}
                                        onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={addExam}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity mt-4"
                                >
                                    Add Exam
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
