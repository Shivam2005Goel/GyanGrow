'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Calculator,
    TrendingUp,
    Award,
    BookOpen,
    GraduationCap,
    Target,
    Info
} from 'lucide-react';

interface Course {
    id: string;
    name: string;
    credits: number;
    grade: string;
    gradePoint: number;
}

interface Semester {
    name: string;
    gpa: number;
    credits: number;
}

const gradeScale = [
    { grade: 'S', points: 10, color: 'text-emerald-400' },
    { grade: 'A', points: 9, color: 'text-emerald-400' },
    { grade: 'A-', points: 8, color: 'text-cyan-400' },
    { grade: 'B+', points: 8, color: 'text-cyan-400' },
    { grade: 'B', points: 7, color: 'text-cyan-400' },
    { grade: 'B-', points: 6, color: 'text-blue-400' },
    { grade: 'C', points: 5, color: 'text-violet-400' },
    { grade: 'C-', points: 4, color: 'text-amber-400' },
    { grade: 'D', points: 3, color: 'text-orange-400' },
    { grade: 'E', points: 2, color: 'text-rose-400' },
    { grade: 'F', points: 0, color: 'text-red-400' },
];

export default function GPACalculator() {
    const [courses, setCourses] = useState<Course[]>([
        { id: '1', name: 'Data Structures & Algorithms', credits: 4, grade: 'A', gradePoint: 9 },
        { id: '2', name: 'Machine Learning', credits: 3, grade: 'A-', gradePoint: 8 },
        { id: '3', name: 'Database Management', credits: 3, grade: 'B+', gradePoint: 8 },
        { id: '4', name: 'Computer Networks', credits: 3, grade: 'A', gradePoint: 9 },
        { id: '5', name: 'Operating Systems', credits: 4, grade: 'B', gradePoint: 7 },
    ]);

    const [semesters, setSemesters] = useState<Semester[]>([
        { name: 'Semester 1', gpa: 8.5, credits: 20 },
        { name: 'Semester 2', gpa: 8.2, credits: 21 },
        { name: 'Semester 3', gpa: 8.8, credits: 22 },
        { name: 'Semester 4', gpa: 8.4, credits: 20 },
        { name: 'Semester 5', gpa: 8.6, credits: 21 },
        { name: 'Semester 6', gpa: 0, credits: 0 },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', credits: 3, grade: 'A' });

    const addCourse = () => {
        if (!newCourse.name.trim()) return;

        const gradeObj = gradeScale.find(g => g.grade === newCourse.grade);
        const course: Course = {
            id: Date.now().toString(),
            name: newCourse.name,
            credits: newCourse.credits,
            grade: newCourse.grade,
            gradePoint: gradeObj?.points || 0,
        };

        setCourses([...courses, course]);
        setNewCourse({ name: '', credits: 3, grade: 'A' });
        setShowAddModal(false);
    };

    const deleteCourse = (id: string) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    const updateCourseGrade = (id: string, grade: string) => {
        const gradeObj = gradeScale.find(g => g.grade === grade);
        setCourses(courses.map(c =>
            c.id === id ? { ...c, grade, gradePoint: gradeObj?.points || 0 } : c
        ));
    };

    const updateCourseCredits = (id: string, credits: number) => {
        setCourses(courses.map(c =>
            c.id === id ? { ...c, credits } : c
        ));
    };

    const calculateCurrentGPA = (): string => {
        if (courses.length === 0) return '0.00';
        const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
        const totalPoints = courses.reduce((acc, c) => acc + (c.credits * c.gradePoint), 0);
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    const calculateCGPA = (): string => {
        const completedSemesters = semesters.filter(s => s.gpa > 0);
        if (completedSemesters.length === 0) return '0.00';
        const totalCredits = completedSemesters.reduce((acc, s) => acc + s.credits, 0);
        const totalPoints = completedSemesters.reduce((acc, s) => acc + (s.gpa * s.credits), 0);
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
    const currentGPA = parseFloat(calculateCurrentGPA());
    const cgpa = parseFloat(calculateCGPA());

    const getGPAColor = (gpa: number) => {
        if (gpa >= 9) return 'from-emerald-500 to-teal-500';
        if (gpa >= 8) return 'from-cyan-500 to-blue-500';
        if (gpa >= 7) return 'from-blue-500 to-indigo-500';
        if (gpa >= 6) return 'from-indigo-500 to-violet-500';
        return 'from-amber-500 to-orange-500';
    };

    const getGradeColor = (grade: string) => {
        return gradeScale.find(g => g.grade === grade)?.color || 'text-white/60';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white/90">GPA Calculator</h2>
                    <p className="text-sm text-white/40">Calculate and track your academic performance</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Course</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br ${getGPAColor(currentGPA)} p-8`}
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm font-medium mb-1">Current Semester GPA</p>
                            <p className="text-6xl font-bold text-white mb-2">{currentGPA}</p>
                            <p className="text-white/60">{totalCredits} credits • {courses.length} courses</p>
                        </div>
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                            <GraduationCap size={40} className="text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 flex flex-col justify-center"
                >
                    <p className="text-white/50 text-sm mb-1">Cumulative GPA</p>
                    <p className="text-4xl font-bold text-white/90 mb-2">{cgpa}</p>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <TrendingUp size={14} />
                        <span>6 semesters completed</span>
                    </div>
                </motion.div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Info size={16} className="text-white/40" />
                    <h3 className="text-sm font-bold text-white/60">Grade Scale</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {gradeScale.map((g) => (
                        <div key={g.grade} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03]">
                            <span className={`font-bold ${g.color}`}>{g.grade}</span>
                            <span className="text-xs text-white/30">→</span>
                            <span className="text-xs text-white/50">{g.points}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="font-bold text-white/90">Current Courses</h3>
                    <span className="text-sm text-white/40">{courses.length} courses</span>
                </div>

                <div className="divide-y divide-white/[0.04]">
                    {courses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white/90 truncate">{course.name}</p>
                                <p className="text-xs text-white/40">{course.credits} credits</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    value={course.grade}
                                    onChange={(e) => updateCourseGrade(course.id, e.target.value)}
                                    className={`px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.06] text-sm font-bold focus:outline-none focus:border-cyan-500/50 ${getGradeColor(course.grade)}`}
                                >
                                    {gradeScale.map((g) => (
                                        <option key={g.grade} value={g.grade} className="bg-slate-900">{g.grade} ({g.points})</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    value={course.credits}
                                    onChange={(e) => updateCourseCredits(course.id, parseInt(e.target.value) || 0)}
                                    min={1}
                                    max={6}
                                    className="w-16 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.06] text-sm text-white/90 text-center focus:outline-none focus:border-cyan-500/50"
                                />

                                <div className="w-16 text-center">
                                    <span className="text-lg font-bold text-white/70">{(course.credits * course.gradePoint).toFixed(0)}</span>
                                </div>

                                <button
                                    onClick={() => deleteCourse(course.id)}
                                    className="p-2 rounded-xl hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {courses.length === 0 && (
                    <div className="p-12 text-center text-white/30">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No courses added yet</p>
                    </div>
                )}
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                <h3 className="font-bold text-white/90 mb-4">Semester History</h3>
                <div className="space-y-3">
                    {semesters.map((sem) => (
                        <div key={sem.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                            <span className="text-sm text-white/60">{sem.name}</span>
                            <div className="flex items-center gap-4">
                                {sem.gpa > 0 ? (
                                    <>
                                        <span className={`text-lg font-bold ${sem.gpa >= 8 ? 'text-cyan-400' : 'text-white/60'}`}>
                                            {sem.gpa.toFixed(2)}
                                        </span>
                                        <span className="text-xs text-white/30">{sem.credits} credits</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-white/30 italic">In progress</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
                            <h3 className="text-xl font-bold text-white/90 mb-6">Add New Course</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/50 mb-2">Course Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Artificial Intelligence"
                                        value={newCourse.name}
                                        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Credits</label>
                                        <input
                                            type="number"
                                            value={newCourse.credits}
                                            onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 0 })}
                                            min={1}
                                            max={6}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 focus:outline-none focus:border-cyan-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/50 mb-2">Expected Grade</label>
                                        <select
                                            value={newCourse.grade}
                                            onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 focus:outline-none focus:border-cyan-500/50"
                                        >
                                            {gradeScale.map((g) => (
                                                <option key={g.grade} value={g.grade} className="bg-slate-900">{g.grade} ({g.points})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={addCourse}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity mt-4"
                                >
                                    Add Course
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
