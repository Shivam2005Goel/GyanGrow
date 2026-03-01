'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, BookOpen, Trophy, Target, Flame, Clock, Star,
    Search, Filter, ChevronRight, TrendingUp, Users,
    X, CheckCircle, Lock, Zap, Lightbulb,
    Crown, Sparkles, ArrowRight, ArrowLeft, Pause,
    ThumbsUp, Share2, Bookmark, MessageCircle,
    GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom icons
function CreditIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>; }
function CalculatorIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /></svg>; }

const CATEGORIES = [
    { id: 'All', name: 'All Courses', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { id: 'Investing', name: 'Investing', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { id: 'Budgeting', name: 'Budgeting', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { id: 'Credit', name: 'Credit & Loans', icon: CreditIcon, color: 'from-orange-500 to-red-500' },
    { id: 'Taxes', name: 'Tax Planning', icon: CalculatorIcon, color: 'from-yellow-500 to-amber-500' },
    { id: 'Entrepreneurship', name: 'Business', icon: Crown, color: 'from-indigo-500 to-purple-500' },
    { id: 'Retirement', name: 'Retirement', icon: Clock, color: 'from-teal-500 to-green-500' },
    { id: 'Cryptocurrency', name: 'Crypto', icon: Zap, color: 'from-pink-500 to-rose-500' },
];

const LEARNING_PATHS = [
    {
        id: 'beginner',
        title: 'Financial Beginner',
        description: 'Master the basics of personal finance',
        icon: Lightbulb,
        color: 'from-green-400 to-emerald-500',
        courses: ['Budgeting', 'Credit', 'Taxes'],
        reward: { coins: 500, badge: 'Beginner Badge' },
    },
    {
        id: 'investor',
        title: 'Smart Investor',
        description: 'Learn to grow your wealth through investing',
        icon: TrendingUp,
        color: 'from-blue-400 to-indigo-500',
        courses: ['Investing', 'Cryptocurrency'],
        reward: { coins: 1000, badge: 'Investor Badge' },
    },
    {
        id: 'entrepreneur',
        title: 'Business Owner',
        description: 'Build and scale your business',
        icon: Crown,
        color: 'from-purple-400 to-pink-500',
        courses: ['Entrepreneurship', 'Taxes'],
        reward: { coins: 1500, badge: 'Entrepreneur Badge' },
    },
];

const mockCoursesData = [
    { id: { videoId: 'zVqczFZr124' }, snippet: { title: 'Personal Finance Basics', description: 'Learn the fundamentals', thumbnails: { medium: { url: 'https://img.youtube.com/vi/zVqczFZr124/mqdefault.jpg' } } }, difficulty: 'Beginner', duration: '15 min', rating: '4.8', students: 12500, xp: 30, category: 'Budgeting' },
    { id: { videoId: 'dQw4w9WgXcQ' }, snippet: { title: 'Stock Market Investing', description: 'Start your investment journey', thumbnails: { medium: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg' } } }, difficulty: 'Intermediate', duration: '25 min', rating: '4.9', students: 8500, xp: 50, category: 'Investing' },
    { id: { videoId: 'JGwWNGJdvx8' }, snippet: { title: 'Cryptocurrency Explained', description: 'Understanding digital currencies', thumbnails: { medium: { url: 'https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg' } } }, difficulty: 'Advanced', duration: '30 min', rating: '4.7', students: 6200, xp: 60, category: 'Cryptocurrency' },
];

const QUIZZES: any = {
    'Investing': [
        { q: 'What is diversification?', options: ['Investing in one stock', 'Spreading investments', 'Saving in bank'], correct: 1 },
        { q: 'What does ROI stand for?', options: ['Return on Investment', 'Risk of Investment', 'Rate of Interest'], correct: 0 },
    ],
    'Budgeting': [
        { q: 'What is the 50/30/20 rule?', options: ['50% needs, 30% wants, 20% savings', '50% savings, 30% needs, 20% wants', 'Equal split'], correct: 0 },
    ],
};

const SimpleHeatmap = ({ data }: { data: any[] }) => {
    return (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="text-sm font-bold text-gray-400 mb-3">Activity</h4>
            <div className="grid grid-cols-7 gap-1 flex-wrap">
                {data.slice(0, 91).map((d, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${d.count === 0 ? 'bg-white/10' : d.count < 3 ? 'bg-purple-500/40' : 'bg-purple-500'}`}
                        title={`${d.count} activities on ${d.date}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function DhanGyanLearning({ onNavigate }: { onNavigate?: (section: string) => void }) {
    const [courses, setCourses] = useState(mockCoursesData);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [currentVideo, setCurrentVideo] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [userProgress, setUserProgress] = useState({ completed: [] as string[], xp: 0, level: 1, streak: 0 });
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState<any>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [activeTab, setActiveTab] = useState('courses');
    const [selectedPath, setSelectedPath] = useState<any>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);

    // Load progress on mount
    useEffect(() => {
        const savedProgress = localStorage.getItem('learning_progress');
        if (savedProgress) setUserProgress(JSON.parse(savedProgress));

        const savedBookmarks = localStorage.getItem('learning_bookmarks');
        if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

        const generateActivity = () => {
            const data = [];
            const today = new Date();
            for (let i = 0; i < 91; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const chance = i < 30 ? 0.7 : i < 90 ? 0.5 : 0.3;
                const hasActivity = Math.random() < chance;
                data.push({
                    date: date.toISOString().split('T')[0],
                    count: hasActivity ? Math.floor(Math.random() * 5) + 1 : 0,
                });
            }
            return data;
        };
        setActivityData(generateActivity());
    }, []);

    // Save progress
    useEffect(() => {
        localStorage.setItem('learning_progress', JSON.stringify(userProgress));
    }, [userProgress]);

    useEffect(() => {
        localStorage.setItem('learning_bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const handleCourseSelect = (course: any) => {
        setCurrentVideo(course);
        setShowVideoModal(true);

        if (!userProgress.completed.includes(course.id.videoId)) {
            setUserProgress(prev => {
                const newXp = prev.xp + course.xp;
                const newLevel = Math.floor(newXp / 100) + 1;
                if (newLevel > prev.level) {
                    confetti({ particleCount: 100, spread: 70 });
                }
                return {
                    ...prev,
                    xp: newXp,
                    completed: [...prev.completed, course.id.videoId],
                    level: newLevel > prev.level ? newLevel : prev.level
                };
            });
        }
    };

    const startQuiz = (category: string) => {
        const quiz = QUIZZES[category];
        if (quiz) {
            setCurrentQuiz({ questions: quiz, current: 0, score: 0 });
            setShowQuiz(true);
        }
    };

    const answerQuiz = (answer: number) => {
        const isCorrect = answer === currentQuiz.questions[currentQuiz.current].correct;
        const newScore = currentQuiz.score + (isCorrect ? 1 : 0);

        if (currentQuiz.current < currentQuiz.questions.length - 1) {
            setCurrentQuiz((prev: any) => ({ ...prev, current: prev.current + 1, score: newScore }));
        } else {
            const finalScore = newScore;
            const reward = finalScore === currentQuiz.questions.length ? 100 : finalScore * 20;
            setUserProgress(prev => ({ ...prev, xp: prev.xp + reward }));
            setQuizScore(finalScore);
            setTimeout(() => {
                setShowQuiz(false);
                setCurrentQuiz(null);
            }, 2000);
        }
    };

    const toggleBookmark = (courseId: string) => {
        setBookmarks(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const filteredCourses = useMemo(() => {
        return courses.filter(course =>
            course.snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'All' || course.category === selectedCategory)
        );
    }, [courses, searchTerm, selectedCategory]);

    const completedCount = userProgress.completed.length;
    const totalCourses = courses.length;
    const progressPercent = totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0;

    const CourseCard = ({ course }: { course: any }) => {
        const isCompleted = userProgress.completed.includes(course.id.videoId);
        const isBookmarked = bookmarks.includes(course.id.videoId);
        const categoryInfo = CATEGORIES.find(c => c.id === course.category) || CATEGORIES[0];
        const Icon = categoryInfo.icon;

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`flex flex-col bg-[#0f0f13] border ${isCompleted ? 'border-[#22c55e]/50' : 'border-white/5'} hover:border-white/20 transition-all cursor-pointer group shadow-lg rounded-[1.2rem] h-full overflow-hidden`}
                onClick={() => handleCourseSelect(course)}
            >
                <div className="relative aspect-video flex-shrink-0">
                    <img
                        src={(course.snippet.thumbnails as any)?.high?.url || course.snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${course.id.videoId}/maxresdefault.jpg`}
                        alt={course.snippet.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-transparent to-transparent" />

                    <div className="absolute top-3 right-3 flex gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(course.id.videoId); }}
                            className="p-1.5 rounded-full hover:scale-110 transition-transform bg-black/40 backdrop-blur-sm"
                        >
                            <Bookmark size={15} className={`text-white transition-colors ${isBookmarked ? 'fill-white' : ''}`} />
                        </button>
                    </div>
                    {isCompleted && (
                        <div className="absolute top-3 left-3 w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center">
                            <CheckCircle size={14} className="text-white" />
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r ${categoryInfo.color} text-white`}>
                            {categoryInfo.name}
                        </span>
                        <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-wide bg-black/70 backdrop-blur-md text-white">
                            {course.difficulty}
                        </span>
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-grow bg-[#0f0f13]">
                    <h3 className="font-bold text-[15px] mb-2 line-clamp-2 leading-snug group-hover:text-purple-400 transition-colors">{course.snippet.title.replace(/&amp;/g, '&')}</h3>
                    <p className="text-[13px] text-gray-400 line-clamp-2 mb-4 leading-relaxed opacity-80">{course.snippet.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mt-auto bg-white/5 px-2 py-1.5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400" /> {course.duration}</div>
                        <div className="flex items-center gap-1.5"><Star size={12} className="text-yellow-400 fill-yellow-400" /> {course.rating}</div>
                        <div className="flex items-center gap-1.5"><Users size={12} className="text-gray-400" /> {(course.students / 1000).toFixed(1)}k</div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="h-full w-full bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden font-sans">
            {/* Header */}
            <header className="flex items-center justify-between py-4 px-6 border-b border-white/5 bg-[#0a0a0f] relative z-20">
                <div className="flex items-center gap-4">
                    {onNavigate && (
                        <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block text-gray-400">
                            <X size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <GraduationCap className="text-purple-400" />
                            Learning Hub
                        </h1>
                        <p className="text-xs text-gray-400">Master financial literacy</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e102f] text-[#d8b4fe] rounded-full text-sm font-bold border border-[#d8b4fe]/20">
                            <Crown size={14} className="text-[#d8b4fe]" />
                            <span>Level {userProgress.level}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a192f] text-[#60a5fa] rounded-full text-sm font-bold border border-[#60a5fa]/20">
                            <Star size={14} className="text-[#60a5fa]" />
                            <span>{userProgress.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2a130f] text-[#fb923c] rounded-full text-sm font-bold border border-[#fb923c]/20">
                            <Flame size={14} className="text-[#fb923c]" />
                            <span>{userProgress.streak || 0} Day Streak</span>
                        </div>
                    </div>
                    {onNavigate && (
                        <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-white/10 rounded-full md:hidden">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Sidebar */}
                <aside className="w-[300px] border-r border-[#ffffff]/10 hidden lg:block p-6 overflow-y-auto bg-[#0a0a0f]">
                    <div className="p-5 bg-gradient-to-br from-[#1e102f] to-[#2a1226] rounded-[1.2rem] border border-[#a855f7]/20 mb-8 shadow-inner">
                        <h3 className="font-bold mb-3 text-[15px] tracking-wide">Your Progress</h3>
                        <div className="flex justify-between text-[13px] mb-3 font-medium">
                            <span className="text-gray-400">{completedCount} of {totalCourses}</span>
                            <span className="text-[#a855f7]">{progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-[6px] bg-[#0a0a0f]/50 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <nav className="space-y-1.5 mb-8">
                        {[
                            { id: 'courses', icon: BookOpen, label: 'All Courses' },
                            { id: 'paths', icon: Target, label: 'Learning Paths' },
                            { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
                            { id: 'achievements', icon: Trophy, label: 'Achievements' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all font-medium text-[15px] ${activeTab === item.id ? 'bg-white/10 text-white shadow-sm font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-gray-500'} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mb-6">
                        <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">Categories</h4>
                        <div className="space-y-1">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setSelectedCategory(cat.id); setActiveTab('courses'); }}
                                    className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all text-[14px] font-medium ${selectedCategory === cat.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    <cat.icon size={18} className={selectedCategory === cat.id ? 'text-white' : 'text-gray-500'} />
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <SimpleHeatmap data={activityData} />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="flex gap-4 mb-6 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto w-full pb-20">
                        {activeTab === 'courses' && (
                            <>
                                {/* Featured Section */}
                                {!searchTerm && selectedCategory === 'All' && courses[0] && (
                                    <div className="mb-12">
                                        <h2 className="text-[22px] font-bold mb-6 tracking-wide">Continue Learning</h2>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative rounded-3xl overflow-hidden cursor-pointer h-[340px] border border-white/5 shadow-2xl group"
                                            onClick={() => handleCourseSelect(courses[0])}
                                        >
                                            <img
                                                src={(courses[0].snippet.thumbnails as any)?.high?.url || courses[0].snippet.thumbnails?.medium?.url}
                                                alt="Featured"
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
                                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                                                <div className="mb-4">
                                                    <span className="px-4 py-1 bg-[#a855f7] text-white rounded-full text-xs font-bold tracking-wider inline-block">Featured</span>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-bold mb-3 max-w-4xl leading-tight">{courses[0].snippet.title.replace(/&amp;/g, '&')}</h3>
                                                <p className="text-gray-300 text-[15px] mb-6 max-w-3xl line-clamp-2 md:line-clamp-1 opacity-80">{courses[0].snippet.description}</p>
                                                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors w-max text-[15px]">
                                                    <Play size={18} className="fill-black" /> Start Learning
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <h2 className="text-[22px] font-bold tracking-wide">
                                            {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
                                        </h2>
                                        <span className="text-sm font-medium text-gray-500">({filteredCourses.length})</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredCourses.map(course => (
                                            <CourseCard key={course.id.videoId} course={course} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'paths' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Learning Paths</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {LEARNING_PATHS.map(path => (
                                        <motion.div
                                            key={path.id}
                                            whileHover={{ y: -5 }}
                                            className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                                            onClick={() => setSelectedPath(path)}
                                        >
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4`}>
                                                <path.icon size={28} className="text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold mb-1">{path.title}</h3>
                                            <p className="text-sm text-gray-400 mb-4">{path.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {path.courses.map(c => (
                                                    <span key={c} className="px-2 py-1 bg-white/10 rounded text-xs">{c}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-purple-400">Reward: {path.reward.coins} coins</span>
                                                <ChevronRight size={16} className="text-gray-400" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'bookmarks' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Bookmarked Courses</h2>
                                {bookmarks.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Bookmark size={48} className="mx-auto mb-4 text-gray-600" />
                                        <p className="text-gray-400">No bookmarks yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {courses.filter(c => bookmarks.includes(c.id.videoId)).map(course => (
                                            <CourseCard key={course.id.videoId} course={course} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {showVideoModal && currentVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-4xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">{currentVideo.snippet.title}</h3>
                                <button onClick={() => setShowVideoModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="aspect-video bg-black rounded-xl overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${currentVideo.id.videoId}?autoplay=1`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="mt-4 flex gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full">
                                    <ThumbsUp size={18} /> Helpful
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                                    <MessageCircle size={18} /> Comment
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showQuiz && currentQuiz && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-6 border border-white/20">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Quiz</h3>
                                <span className="text-sm text-gray-400">{currentQuiz.current + 1} / {currentQuiz.questions.length}</span>
                            </div>
                            <p className="text-lg mb-6">{currentQuiz.questions[currentQuiz.current].q}</p>
                            <div className="space-y-3">
                                {currentQuiz.questions[currentQuiz.current].options.map((opt: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => answerQuiz(i)}
                                        className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
