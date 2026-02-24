'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Play,
    Search,
    BookOpen,
    Trophy,
    Clock,
    X,
    Award,
    TrendingUp,
    Flame,
    CheckCircle,
    Lock,
    Zap,
    Loader2,
    Sparkles,
    Target,
    Brain,
    Eye,
    History,
    Crown,
    Medal,
    ChevronRight,
    Hexagon,
    Filter,
    Star,
    Bookmark,
    BookmarkCheck,
    LayoutGrid,
    List,
    Clock3,
    BarChart2,
    Star as StarIcon,
    Users,
    Lightbulb,
    ArrowUpRight,
    RefreshCw,
    Mic,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { YouTubeVideo, Quiz } from '@/types/learning';
import { mockLeaderboard, parseDuration, formatViewCount, mockSkills } from '@/data/learningData';
import { searchYouTubeVideos } from '@/lib/youtubeApi';
import { generateQuizFromVideo, calculateQuizPoints, generateQuizId } from '@/lib/quizGenerator';
import { fireConfetti, firePerfectScoreCelebration } from '@/lib/confetti';
import Squares from '@/components/Squares';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'programming', label: 'Programming', icon: Lightbulb },
    { id: 'datascience', label: 'Data Science', icon: BarChart2 },
    { id: 'webdev', label: 'Web Development', icon: Code },
    { id: 'ai', label: 'AI/ML', icon: Brain },
    { id: 'mobile', label: 'Mobile Dev', icon: Smartphone },
    { id: 'devops', label: 'DevOps', icon: Cloud },
];

const QUICK_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'recent', label: 'Recent' },
    { id: 'bookmarked', label: 'Bookmarked' },
    { id: 'continue', label: 'Continue' },
];

// Code icon fallback
function Code({ size = 16, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    );
}

function Smartphone({ size = 16, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    );
}

function Cloud({ size = 16, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
    );
}

// ============================================================
// Video Player Modal (Enhanced)
// ============================================================
function VideoPlayerModal({
    video,
    isOpen,
    onClose,
    onVideoComplete,
    onQuizComplete,
    watched,
    completedQuizId,
    isBookmarked,
    onToggleBookmark,
}: {
    video: YouTubeVideo;
    isOpen: boolean;
    onClose: () => void;
    onVideoComplete: (videoId: string) => void;
    onQuizComplete: (quizId: string, score: number, pointsEarned: number) => void;
    watched: boolean;
    completedQuizId?: string;
    isBookmarked: boolean;
    onToggleBookmark: () => void;
}) {
    const [isCompleted, setIsCompleted] = useState(watched);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [showSidebar, setShowSidebar] = useState(true);
    const [mute, setMute] = useState(false);

    // Reset state when video changes
    useEffect(() => {
        setIsCompleted(watched);
        setQuiz(null);
        setIsQuizCompleted(false);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setQuizStarted(false);
    }, [video.id, watched]);

    const handleGenerateQuiz = async () => {
        setIsGeneratingQuiz(true);
        try {
            const generated = await generateQuizFromVideo(video.id, video.title, video.description, 5);
            if (generated) {
                const newQuiz: Quiz = {
                    id: generateQuizId(video.id),
                    videoId: video.id,
                    courseId: 'dynamic',
                    title: generated.title,
                    questions: generated.questions,
                    timeLimit: Math.max(5, generated.questions.length * 2),
                    passingScore: 60,
                    rewardPoints: 100,
                };
                setQuiz(newQuiz);
                setTimeLeft(newQuiz.timeLimit * 60);
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    const handleComplete = () => {
        setIsCompleted(true);
        onVideoComplete(video.id);
    };

    useEffect(() => {
        if (quizStarted && !isQuizCompleted && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0 && !isQuizCompleted && quiz) {
            handleFinishQuiz();
        }
    }, [quizStarted, isQuizCompleted, timeLeft, quiz]);

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null || !quiz) return;
        if (selectedAnswer === quiz.questions[currentQuestion].correctAnswer) {
            setScore(prev => prev + 1);
        }
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        if (!quiz) return;
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            handleFinishQuiz();
        }
    };

    const handleFinishQuiz = () => {
        if (!quiz) return;
        setIsQuizCompleted(true);
        const percentage = (score / quiz.questions.length) * 100;
        const calculatedPoints = calculateQuizPoints(score, quiz.questions.length, quiz.timeLimit * 60 - timeLeft, quiz.timeLimit * 60);
        setPointsEarned(calculatedPoints);
        onQuizComplete(quiz.id, score, calculatedPoints);
        if (percentage === 100) firePerfectScoreCelebration();
        else if (percentage >= 60) fireConfetti();
    };

    const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'm' || e.key === 'M') setMute(m => !m);
            if (e.key === 'b' || e.key === 'B') onToggleBookmark();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onToggleBookmark]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 md:p-4">
            <div className="relative w-full max-w-[1600px] h-[98vh] md:h-[90vh] bg-[#07090e] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_-20px_rgba(6,182,212,0.15)] flex flex-col md:flex-row">
                {/* Close & Controls */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button onClick={onToggleBookmark}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/60 hover:text-yellow-400 hover:scale-105 transition-all shadow-xl">
                        {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>
                    <button onClick={() => setMute(m => !m)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:scale-105 transition-all shadow-xl">
                        {mute ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button onClick={() => setShowSidebar(s => !s)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:scale-105 transition-all shadow-xl hidden md:flex">
                        <ChevronRight size={20} className={`transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={onClose} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:scale-105 transition-all shadow-xl">
                        <X size={20} />
                    </button>
                </div>

                {/* Left Side: Video Player */}
                <div className="flex-1 flex flex-col p-3 md:p-5 lg:p-6 overflow-y-auto">
                    <div className="aspect-video w-full max-w-5xl mx-auto rounded-2xl overflow-hidden bg-black mb-5 shadow-2xl border border-white/[0.05] relative">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&mute=${mute ? 1 : 0}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                        {/* Keyboard hint */}
                        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                            <span className="px-2 py-1 bg-black/70 rounded text-[10px] text-white/50">M: Mute</span>
                            <span className="px-2 py-1 bg-black/70 rounded text-[10px] text-white/50">B: Bookmark</span>
                            <span className="px-2 py-1 bg-black/70 rounded text-[10px] text-white/50">ESC: Close</span>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto w-full">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">{video.title}</h2>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-medium text-white/80">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
                                        {video.channelTitle}
                                    </span>
                                    <span className="flex items-center gap-1 text-white/40 text-sm">
                                        <Eye size={14} /> {formatViewCount(video.viewCount)}
                                    </span>
                                    <span className="flex items-center gap-1 text-white/40 text-sm">
                                        <Clock size={14} /> {parseDuration(video.duration)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleComplete}
                                    disabled={isCompleted}
                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500 text-black hover:bg-cyan-400 hover:-translate-y-0.5'}`}
                                >
                                    <CheckCircle size={16} />
                                    {isCompleted ? 'Completed' : 'Complete'}
                                </button>
                            </div>
                        </div>

                        {/* Video description */}
                        <div className="mt-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                            <p className="text-white/60 text-sm line-clamp-3">{video.description || 'No description available.'}</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Quiz Section - Collapsible */}
                <AnimatePresence>
                    {showSidebar && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 400, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="w-full md:w-[400px] border-t md:border-t-0 md:border-l border-white/[0.08] bg-gradient-to-b from-[#0a0c14] to-[#07090e] overflow-y-auto relative flex flex-col justify-center"
                        >
                            <div className="p-6 lg:p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                                        <Brain size={24} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white leading-none">Knowledge Check</h3>
                                        <p className="text-xs text-white/40 mt-1">Test what you've learned</p>
                                    </div>
                                </div>

                                {!isCompleted ? (
                                    <div className="text-center py-10 px-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                            <Lock size={28} className="text-white/20" />
                                        </div>
                                        <h4 className="text-base font-bold text-white mb-2">Quiz Locked</h4>
                                        <p className="text-white/50 text-sm leading-relaxed">Watch the video to unlock this quiz and earn XP.</p>
                                    </div>
                                ) : completedQuizId ? (
                                    <div className="text-center py-10 px-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-emerald-500/10 blur-[80px]" />
                                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-4 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                            <CheckCircle size={40} className="text-emerald-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2 relative z-10">Quiz Mastered!</h4>
                                        <p className="text-emerald-400/60 text-sm relative z-10 font-medium">You've secured the XP</p>
                                    </div>
                                ) : !quiz ? (
                                    <div className="text-center py-8 px-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl relative overflow-hidden">
                                        {isGeneratingQuiz ? (
                                            <div className="relative z-10 py-4">
                                                <div className="w-20 h-20 mx-auto mb-6 relative">
                                                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                                                    <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Brain size={24} className="text-cyan-400" />
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-2">AI is analyzing...</h4>
                                                <p className="text-white/50 text-sm">Crafting custom questions</p>
                                            </div>
                                        ) : (
                                            <div className="relative z-10">
                                                <div className="absolute inset-0 bg-violet-500/10 blur-[60px] -z-10" />
                                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                                    <Target size={36} className="text-violet-400" />
                                                </div>
                                                <h4 className="text-xl font-bold text-white mb-2">Challenge Ready</h4>
                                                <p className="text-white/50 text-sm mb-6">5 questions · 60% to pass</p>
                                                <button
                                                    onClick={handleGenerateQuiz}
                                                    className="w-full py-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.02]"
                                                >
                                                    Start Challenge
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : !quizStarted ? (
                                    <div className="space-y-5">
                                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-2xl">
                                            <h4 className="font-bold text-lg text-white mb-4">{quiz.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                                    <p className="text-2xl font-black text-white mb-1">{quiz.questions.length}</p>
                                                    <p className="text-xs text-white/50 font-medium tracking-wide">QUESTIONS</p>
                                                </div>
                                                <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                                    <p className="text-2xl font-black text-white mb-1">{quiz.timeLimit}</p>
                                                    <p className="text-xs text-white/50 font-medium tracking-wide">MINUTES</p>
                                                </div>
                                                <div className="flex-1 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                                                    <p className="text-2xl font-black text-cyan-400 mb-1">+{quiz.rewardPoints}</p>
                                                    <p className="text-xs text-cyan-500/50 font-medium tracking-wide">XP</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setQuizStarted(true)}
                                            className="w-full py-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_-4px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all"
                                        >
                                            Begin Quiz
                                        </button>
                                    </div>
                                ) : !isQuizCompleted ? (
                                    <div className="space-y-5 flex-1 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs font-bold text-white/80">Question {currentQuestion + 1} of {quiz.questions.length}</span>
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                                <Clock size={12} />
                                                <span className="font-mono">{formatTime(timeLeft)}</span>
                                            </div>
                                        </div>

                                        {/* Progress dots */}
                                        <div className="flex gap-1.5 justify-center">
                                            {quiz.questions.map((_, idx) => (
                                                <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx < currentQuestion ? 'bg-emerald-400' : idx === currentQuestion ? 'bg-cyan-400 w-4' : 'bg-white/20'}`} />
                                            ))}
                                        </div>

                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-lg">
                                            <p className="text-white text-base font-medium leading-relaxed">{quiz.questions[currentQuestion].question}</p>
                                        </div>

                                        <div className="space-y-2.5">
                                            {quiz.questions[currentQuestion].options.map((option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => !showExplanation && setSelectedAnswer(index)}
                                                    className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all group shrink-0 ${showExplanation
                                                        ? index === quiz.questions[currentQuestion].correctAnswer
                                                            ? 'bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                            : selectedAnswer === index
                                                                ? 'bg-rose-500/10 border-2 border-rose-500/50 text-rose-300'
                                                                : 'bg-white/5 border-2 border-transparent text-white/30'
                                                        : selectedAnswer === index
                                                            ? 'bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.01]'
                                                            : 'bg-white/[0.03] border-2 border-transparent text-white/70 hover:bg-white/[0.06] hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex gap-3 items-center">
                                                        <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${selectedAnswer === index || (showExplanation && index === quiz.questions[currentQuestion].correctAnswer) ? 'bg-current text-white mix-blend-overlay' : 'bg-white/10'}`}>
                                                            {String.fromCharCode(65 + index)}
                                                        </span>
                                                        <span className="flex-1 leading-snug">{option}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={showExplanation ? handleNextQuestion : handleSubmitAnswer}
                                            disabled={!showExplanation && selectedAnswer === null}
                                            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl font-bold text-[13px] shadow-xl uppercase tracking-wide disabled:opacity-30 disabled:grayscale transition-all hover:scale-[1.02]"
                                        >
                                            {showExplanation ? (currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'View Results') : 'Submit Answer'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 px-5">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-[3px] mx-auto mb-5 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                            <div className="w-full h-full bg-[#0a0c14] rounded-full flex items-center justify-center border-4 border-[#0a0c14]">
                                                <Trophy size={40} className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-500" style={{ fill: 'url(#gradient-win)' }} />
                                                <svg width="0" height="0">
                                                    <linearGradient id="gradient-win" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop stopColor="#34d399" offset="0%" />
                                                        <stop stopColor="#22d3ee" offset="100%" />
                                                    </linearGradient>
                                                </svg>
                                            </div>
                                        </div>
                                        <h4 className="text-2xl font-black text-white mb-2">Quiz Complete!</h4>
                                        <p className="text-white/50 text-sm mb-6">You scored {score} out of {quiz.questions.length}</p>

                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center">
                                                <p className="text-3xl font-black text-cyan-400 mb-1">+{pointsEarned}</p>
                                                <p className="text-xs font-bold text-cyan-500/50 uppercase tracking-widest">XP Earned</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 flex flex-col items-center justify-center">
                                                <p className="text-3xl font-black text-violet-400 mb-1">{Math.round((score / quiz.questions.length) * 100)}%</p>
                                                <p className="text-xs font-bold text-violet-500/50 uppercase tracking-widest">Accuracy</p>
                                            </div>
                                        </div>
                                        <button onClick={onClose} className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-sm transition-all border border-white/5">
                                            Return to Hub
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ============================================================
// Enhanced Video Card
// ============================================================
function EnhancedVideoCard({
    video,
    isWatched,
    hasQuizDone,
    isBookmarked,
    onPlay,
    onToggleBookmark,
    watchProgress = 0,
}: {
    video: YouTubeVideo;
    isWatched: boolean;
    hasQuizDone: boolean;
    isBookmarked: boolean;
    onPlay: () => void;
    onToggleBookmark: () => void;
    watchProgress?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer flex flex-col h-full bg-white/[0.01] hover:bg-white/[0.03] p-2.5 rounded-2xl border border-transparent hover:border-white/[0.06] hover:shadow-2xl transition-all duration-300"
            onClick={onPlay}
        >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/[0.05] group-hover:border-cyan-500/50 shadow-lg transition-all duration-500 group-hover:shadow-[0_8px_30px_-12px_rgba(6,182,212,0.4)] mb-3">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                {/* Progress bar */}
                {watchProgress > 0 && watchProgress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                        <div className="h-full bg-cyan-500" style={{ width: `${watchProgress}%` }} />
                    </div>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                    </div>
                </div>
                <div className="absolute bottom-1.5 right-1.5 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                    {parseDuration(video.duration)}
                </div>

                {/* Status badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                    {isWatched && (
                        <div className="px-2 py-1 rounded-md bg-emerald-500/90 text-white flex items-center gap-1 shadow-lg text-[10px] font-bold">
                            <CheckCircle size={10} className="text-white" /> Watched
                        </div>
                    )}
                    {hasQuizDone && (
                        <div className="px-2 py-1 rounded-md bg-violet-500/90 text-white flex items-center gap-1 shadow-lg text-[10px] font-bold">
                            <Award size={10} className="text-white" /> Quiz
                        </div>
                    )}
                </div>

                {/* Bookmark button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                >
                    {isBookmarked ? <BookmarkCheck size={14} className="text-yellow-400" /> : <Bookmark size={14} className="text-white" />}
                </button>
            </div>

            <div className="px-1 flex-1 flex flex-col">
                <h4 className="text-[13px] font-bold text-white/90 leading-snug line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors">{video.title}</h4>
                <p className="text-xs text-white/50 flex flex-wrap items-center gap-1.5 mt-auto font-medium">
                    <span>{video.channelTitle}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1 text-white/40"><Eye size={12} /> {formatViewCount(video.viewCount)}</span>
                </p>
            </div>
        </motion.div>
    );
}

// ============================================================
// Main Learning Hub Component (Enhanced)
// ============================================================
export default function LearningHub() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
    const [recommendedVideos, setRecommendedVideos] = useState<YouTubeVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
    const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set<string>());
    const [bookmarkedVideos, setBookmarkedVideos] = useState<Set<string>>(new Set<string>());
    const [completedQuizzes, setCompletedQuizzes] = useState<Map<string, { score: number; points: number }>>(new Map());
    const [totalPoints, setTotalPoints] = useState(1250);
    const [streak, setStreak] = useState(7);
    const [searchHistory, setSearchHistory] = useState<string[]>(['React tutorial', 'Python basics', 'Machine learning']);
    const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeFilter, setActiveFilter] = useState('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Load saved data
    useEffect(() => {
        const saved = localStorage.getItem('vitgroww_learning');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.watchedVideos) setWatchedVideos(new Set(data.watchedVideos));
                if (data.bookmarkedVideos) setBookmarkedVideos(new Set(data.bookmarkedVideos));
                if (data.completedQuizzes) setCompletedQuizzes(new Map(data.completedQuizzes));
                if (data.totalPoints) setTotalPoints(data.totalPoints);
                if (data.streak) setStreak(data.streak);
            } catch { }
        }
    }, []);

    // Save data
    useEffect(() => {
        localStorage.setItem('vitgroww_learning', JSON.stringify({
            watchedVideos: Array.from(watchedVideos),
            bookmarkedVideos: Array.from(bookmarkedVideos),
            completedQuizzes: Array.from(completedQuizzes.entries()),
            totalPoints,
            streak,
        }));
    }, [watchedVideos, bookmarkedVideos, completedQuizzes, totalPoints, streak]);

    // Load recommended videos
    useEffect(() => {
        const loadRecommended = async () => {
            setIsLoading(true);
            try {
                const results = await searchYouTubeVideos('programming tutorial', 30);
                setRecommendedVideos(results);
            } catch (error) {
                console.error('Error loading recommended:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadRecommended();
    }, []);

    const handleSearch = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchHistory(prev => [searchQuery, ...prev.filter(q => q !== searchQuery).slice(0, 4)]);
        setActiveFilter('all');

        try {
            const results = await searchYouTubeVideos(searchQuery, 50);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery]);

    const handleVideoComplete = useCallback((videoId: string) => {
        setWatchedVideos(prev => new Set([...prev, videoId]));
        setTotalPoints(prev => prev + 10);
    }, []);

    const handleQuizComplete = useCallback((quizId: string, score: number, pointsEarned: number) => {
        setCompletedQuizzes(prev => new Map([...prev, [quizId, { score, points: pointsEarned }]]));
        setTotalPoints(prev => prev + pointsEarned);
        setLeaderboard(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(e => e.userId === 'user-3');
            if (idx !== -1) {
                updated[idx] = { ...updated[idx], totalPoints: updated[idx].totalPoints + pointsEarned, quizzesCompleted: updated[idx].quizzesCompleted + 1 };
            }
            updated.sort((a, b) => b.totalPoints - a.totalPoints);
            return updated.map((entry, index) => ({ ...entry, rank: index + 1 }));
        });
    }, []);

    const toggleBookmark = useCallback((videoId: string) => {
        setBookmarkedVideos(prev => {
            const newSet = new Set(prev);
            if (newSet.has(videoId)) {
                newSet.delete(videoId);
            } else {
                newSet.add(videoId);
            }
            return newSet;
        });
    }, []);

    // Filter videos
    const filteredVideos = useMemo(() => {
        let videos = searchResults.length > 0 ? searchResults : recommendedVideos;

        // Apply quick filter
        if (activeFilter === 'bookmarked') {
            videos = videos.filter(v => bookmarkedVideos.has(v.id));
        } else if (activeFilter === 'continue') {
            videos = videos.filter(v => !watchedVideos.has(v.id));
        } else if (activeFilter === 'popular') {
            videos = [...videos].sort((a, b) => b.viewCount - a.viewCount);
        }

        return videos;
    }, [searchResults, recommendedVideos, activeFilter, bookmarkedVideos, watchedVideos]);

    // Daily goal progress
    const dailyGoal = 3;
    const todayProgress = Math.min(watchedVideos.size % dailyGoal, dailyGoal);

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <Squares direction="diagonal" speed={0.3} borderColor="#1e3a5f" squareSize={50} hoverFillColor="#0ea5e9" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex p-3 md:p-4 gap-3">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <motion.div whileHover={{ scale: 1.05, rotate: -5 }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <BookOpen size={22} className="text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                    Learning Hub
                                    <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                                </h1>
                                <p className="text-white/40 text-xs">{filteredVideos.length} videos available</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Daily Goal */}
                            <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center gap-2">
                                <Target size={14} className="text-emerald-400" />
                                <div className="flex items-center gap-1.5">
                                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${(todayProgress / dailyGoal) * 100}%` }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-400">{todayProgress}/{dailyGoal}</span>
                                </div>
                            </div>
                            {/* XP */}
                            <div className="px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1.5">
                                <Zap size={14} className="text-cyan-400" />
                                <span className="text-sm font-bold text-cyan-400">{totalPoints.toLocaleString()}</span>
                            </div>
                            {/* Streak */}
                            <div className="px-3 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center gap-1.5">
                                <Flame size={14} className="text-orange-400" />
                                <span className="text-sm font-bold text-orange-400">{streak}</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-2 mb-3 flex-shrink-0">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search video lectures, topics..."
                                className="w-full pl-9 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>
                        <button type="submit" disabled={isSearching} className="px-4 py-2.5 bg-cyan-500 text-black rounded-xl font-bold text-sm hover:bg-cyan-400 disabled:opacity-50 flex items-center gap-1.5">
                            {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                        </button>
                    </form>

                    {/* Category Filters */}
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0 overflow-x-auto pb-1 scrollbar-hide">
                        <Filter size={14} className="text-white/30 flex-shrink-0" />
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeCategory === cat.id ? 'text-white' : 'text-white/45 hover:text-white/70'}`}
                                >
                                    {activeCategory === cat.id && (
                                        <motion.div layoutId="lhCategory" className="absolute inset-0 bg-cyan-500/15 rounded-lg border border-cyan-500/25" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5"><Icon size={12} /> {cat.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        <div className="flex bg-white/[0.02] rounded-xl border border-white/[0.05] p-0.5">
                            {QUICK_FILTERS.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === filter.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                >
                                    {activeFilter === filter.id && (
                                        <motion.div layoutId="lhQuickFilter" className="absolute inset-0 bg-cyan-500/15 rounded-lg" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                                    )}
                                    <span className="relative z-10">{filter.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="ml-auto flex gap-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30'}`}>
                                <LayoutGrid size={16} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30'}`}>
                                <List size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Search History */}
                    {searchHistory.length > 0 && searchResults.length === 0 && (
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0 overflow-x-auto pb-1">
                            <History size={12} className="text-white/30 flex-shrink-0" />
                            {searchHistory.map((query, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setSearchQuery(query); }}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-all whitespace-nowrap"
                                >
                                    {query}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        {isLoading && !searchResults.length ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <Loader2 size={40} className="text-cyan-400 animate-spin mx-auto mb-3" />
                                    <p className="text-white/40 text-sm">Loading your learning content...</p>
                                </div>
                            </div>
                        ) : filteredVideos.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Search size={32} className="text-white/20" />
                                    </div>
                                    <p className="text-white/40 text-sm mb-2">No videos found</p>
                                    <p className="text-white/30 text-xs">Try a different search or filter</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                                {/* Featured Section */}
                                {activeFilter !== 'bookmarked' && activeFilter !== 'continue' && filteredVideos.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500">
                                                <Sparkles size={14} className="text-white" />
                                            </div>
                                            <h3 className="text-sm font-bold text-white">Featured Course</h3>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative group cursor-pointer"
                                            onClick={() => setSelectedVideo(filteredVideos[0])}
                                        >
                                            <div className="relative h-[280px] md:h-[320px] rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]">
                                                <img
                                                    src={filteredVideos[0].thumbnail}
                                                    alt={filteredVideos[0].title}
                                                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#040608] via-black/50 to-transparent" />

                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-20 h-20 rounded-full bg-cyan-500/90 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                                                        <Play size={32} className="text-white ml-1" fill="white" />
                                                    </div>
                                                </div>

                                                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-xs text-white font-bold border border-white/10 shadow-xl">
                                                    {parseDuration(filteredVideos[0].duration)}
                                                </div>

                                                {watchedVideos.has(filteredVideos[0].id) && (
                                                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 shadow-xl">
                                                        <CheckCircle size={14} className="text-emerald-400" />
                                                        <span className="text-xs font-bold text-emerald-400">Completed</span>
                                                    </div>
                                                )}

                                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 border border-cyan-500/30 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3">Featured</span>
                                                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 line-clamp-2 leading-tight">{filteredVideos[0].title}</h3>
                                                    <div className="flex items-center gap-3 text-xs font-medium text-white/70">
                                                        <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md">
                                                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                                                            {filteredVideos[0].channelTitle}
                                                        </span>
                                                        <span className="flex items-center gap-1"><Eye size={12} /> {formatViewCount(filteredVideos[0].viewCount)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}

                                {/* Section Title */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        {activeFilter === 'all' && 'All Videos'}
                                        {activeFilter === 'popular' && 'Popular Videos'}
                                        {activeFilter === 'recent' && 'Recent Videos'}
                                        {activeFilter === 'bookmarked' && 'Bookmarked'}
                                        {activeFilter === 'continue' && 'Continue Learning'}
                                    </h3>
                                    <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{filteredVideos.length} videos</span>
                                </div>

                                {/* Video Grid */}
                                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
                                    {filteredVideos.slice(activeFilter === 'all' || activeFilter === 'popular' || activeFilter === 'recent' ? 1 : 0).map((video, idx) => (
                                        <EnhancedVideoCard
                                            key={video.id}
                                            video={video}
                                            isWatched={watchedVideos.has(video.id)}
                                            hasQuizDone={completedQuizzes.has(`quiz-${video.id}`)}
                                            isBookmarked={bookmarkedVideos.has(video.id)}
                                            onPlay={() => setSelectedVideo(video)}
                                            onToggleBookmark={() => toggleBookmark(video.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Collapsible */}
                <AnimatePresence>
                    {!sidebarCollapsed && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="hidden xl:flex flex-col w-[280px] flex-shrink-0 gap-3 overflow-y-auto pr-1 pb-20"
                        >
                            {/* Mini Stats */}
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Your Progress</h3>
                                    <Target size={14} className="text-cyan-400" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                                        <p className="text-xl font-black text-cyan-400">{totalPoints.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-cyan-500/50 uppercase">Total XP</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                                        <p className="text-xl font-black text-orange-400">{streak}</p>
                                        <p className="text-[9px] font-bold text-orange-500/50 uppercase">Day Streak</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
                                        <p className="text-xl font-black text-violet-400">{watchedVideos.size}</p>
                                        <p className="text-[9px] font-bold text-violet-500/50 uppercase">Watched</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                        <p className="text-xl font-black text-emerald-400">{completedQuizzes.size}</p>
                                        <p className="text-[9px] font-bold text-emerald-500/50 uppercase">Quizzes</p>
                                    </div>
                                </div>
                            </div>

                            {/* Leaderboard Mini */}
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Trophy size={14} className="text-yellow-400" />
                                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Top Learners</h3>
                                </div>
                                <div className="space-y-2">
                                    {leaderboard.slice(0, 4).map((entry) => (
                                        <div key={entry.userId} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${entry.rank === 1 ? 'bg-yellow-500 text-black' : entry.rank === 2 ? 'bg-gray-400 text-black' : entry.rank === 3 ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/40'}`}>
                                                {entry.rank}
                                            </span>
                                            <span className="flex-1 text-xs text-white/70 truncate">{entry.userName}</span>
                                            <span className="text-xs font-bold text-cyan-400">{entry.totalPoints}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bookmarks Count */}
                            {bookmarkedVideos.size > 0 && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bookmark size={14} className="text-yellow-400" />
                                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Saved Videos</h3>
                                    </div>
                                    <p className="text-lg font-black text-yellow-400">{bookmarkedVideos.size}</p>
                                    <p className="text-[10px] text-yellow-400/50">Videos bookmarked for later</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar Toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden xl:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                >
                    <ChevronRight size={16} className={`text-white/50 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
                </button>
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <VideoPlayerModal
                    video={selectedVideo}
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    onVideoComplete={handleVideoComplete}
                    onQuizComplete={handleQuizComplete}
                    watched={watchedVideos.has(selectedVideo.id)}
                    completedQuizId={completedQuizzes.has(`quiz-${selectedVideo.id}`) ? `quiz-${selectedVideo.id}` : undefined}
                    isBookmarked={bookmarkedVideos.has(selectedVideo.id)}
                    onToggleBookmark={() => toggleBookmark(selectedVideo.id)}
                />
            )}
        </div>
    );
}
