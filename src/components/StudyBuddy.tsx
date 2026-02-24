'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpenCheck, Sparkles, Loader2, Trash2, Save, RefreshCw, Plus,
    Brain, Lightbulb, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
    Layers, RotateCcw, Zap, Target, Award, FileText, Copy, BookOpen,
    Shuffle, Keyboard, Clock, TrendingUp, Star, Bookmark, BookmarkCheck,
    Volume2, Share2, Download, Edit3, PlusCircle, MinusCircle, Eye, EyeOff
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Flashcard {
    id: string;
    front: string;
    back: string;
    reviewed: boolean;
    correct: boolean | null;
    bookmarked: boolean;
}

interface Deck {
    id: string;
    name: string;
    topic: string;
    cards: Flashcard[];
    createdAt: Date;
    isFavorite: boolean;
}

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

interface StudySession {
    date: Date;
    cardsReviewed: number;
    correctCount: number;
    quizScore: number;
    totalQuestions: number;
}

export default function StudyBuddy() {
    const [activeTab, setActiveTab] = useState<'flashcards' | 'summary' | 'quiz'>('flashcards');
    const [inputText, setInputText] = useState('');
    const [generating, setGenerating] = useState(false);

    // Flashcard state
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [savedDecks, setSavedDecks] = useState<Deck[]>([]);
    const [shuffled, setShuffled] = useState(false);

    // Summary state
    const [summary, setSummary] = useState<{ title: string; points: string[]; keywords: string[] } | null>(null);
    const [bookmarkedPoints, setBookmarkedPoints] = useState<number[]>([]);

    // Quiz state
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    // Session stats
    const [sessionStats, setSessionStats] = useState<StudySession>({
        date: new Date(),
        cardsReviewed: 0,
        correctCount: 0,
        quizScore: 0,
        totalQuestions: 0
    });

    // UI state
    const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

    // Load saved decks
    useEffect(() => {
        const saved = localStorage.getItem('vitgroww_flashcard_decks');
        if (saved) {
            try {
                setSavedDecks(JSON.parse(saved).map((d: any) => ({ ...d, createdAt: new Date(d.createdAt) })));
            } catch { }
        }
    }, []);

    // Load session stats
    useEffect(() => {
        const stats = localStorage.getItem('vitgroww_study_session');
        if (stats) {
            try {
                const parsed = JSON.parse(stats);
                setSessionStats({ ...parsed, date: new Date(parsed.date) });
            } catch { }
        }
    }, []);

    // Save session stats
    const updateSessionStats = useCallback((cardsRev: number, correct: number, quiz: number, total: number) => {
        const newStats = {
            date: new Date(),
            cardsReviewed: sessionStats.cardsReviewed + cardsRev,
            correctCount: sessionStats.correctCount + correct,
            quizScore: sessionStats.quizScore + quiz,
            totalQuestions: sessionStats.totalQuestions + total
        };
        setSessionStats(newStats);
        localStorage.setItem('vitgroww_study_session', JSON.stringify(newStats));
    }, [sessionStats]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (activeTab === 'flashcards' && cards.length > 0) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    setFlipped(!flipped);
                } else if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    setCurrentIndex(Math.max(0, currentIndex - 1));
                    setFlipped(false);
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1));
                    setFlipped(false);
                } else if (e.code === 'KeyA' || e.code === 'KeyX') {
                    e.preventDefault();
                    markCard(false);
                } else if (e.code === 'KeyD' || e.code === 'KeyC') {
                    e.preventDefault();
                    markCard(true);
                }
            } else if (activeTab === 'quiz' && quizQuestions.length > 0 && !quizComplete) {
                if (e.code === 'Digit1' || e.code === 'Digit2' || e.code === 'Digit3' || e.code === 'Digit4') {
                    if (selectedAnswer === null) {
                        handleQuizAnswer(parseInt(e.code.replace('Digit', '')) - 1);
                    }
                } else if (e.code === 'Enter' && selectedAnswer !== null) {
                    nextQuizQuestion();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, cards, currentIndex, flipped, quizQuestions, quizIndex, selectedAnswer, quizComplete]);

    const generateFlashcards = async () => {
        if (!inputText.trim()) return;
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) return alert("Gemini API key is missing. Check your .env.local");

        setGenerating(true);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: "application/json" } });

            const prompt = `Create 8 study flashcards from these notes/topic: "${inputText}". 
            Return ONLY a valid JSON array of objects with "front" (Question/Concept) and "back" (Clear, concise answer). Make them highly educational.`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
            const newCards = parsed.map((c: any, i: number) => ({
                id: `card-${Date.now()}-${i}`,
                front: c.front,
                back: c.back,
                reviewed: false,
                correct: null,
                bookmarked: false
            }));
            setCards(newCards);
            setCurrentIndex(0);
            setFlipped(false);
            setShuffled(false);
        } catch (e) {
            console.error("Flashcard matching failed", e);
            alert('Failed to generate flashcards.');
        } finally {
            setGenerating(false);
        }
    };

    const generateSummary = async () => {
        if (!inputText.trim()) return;
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) return alert("Gemini API key is missing. Check your .env.local");

        setGenerating(true);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: "application/json" } });

            const prompt = `Summarize these notes/topic concisely but with high detail: "${inputText}".
            Return a valid JSON object with "title" (Topic Title), "points" (array of highly informative key points), and "keywords" (array of important terms).`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
            setSummary(parsed);
            setBookmarkedPoints([]);
        } catch (e) {
            console.error("Summary failed", e);
            alert('Failed to generate summary.');
        } finally {
            setGenerating(false);
        }
    };

    const generateQuiz = async () => {
        if (!inputText.trim()) return;
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) return alert("Gemini API key is missing. Check your .env.local");

        setGenerating(true);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: "application/json" } });

            const prompt = `Create 5 advanced MCQ quiz questions from: "${inputText}".
            Return a JSON array of objects with "question", "options" (array of 4 strings), "correct" (index 0-3 of correct option), and "explanation" (detailed reasoning).`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

            setQuizQuestions(parsed);
            setQuizIndex(0);
            setQuizScore(0);
            setQuizComplete(false);
            setSelectedAnswer(null);
        } catch (e) {
            console.error(e);
            alert('Failed to generate quiz.');
        } finally {
            setGenerating(false);
        }
    };

    const saveDeck = () => {
        if (cards.length === 0) return;
        const deck: Deck = {
            id: `deck-${Date.now()}`,
            name: inputText.substring(0, 40),
            topic: inputText.substring(0, 100),
            cards,
            createdAt: new Date(),
            isFavorite: false
        };
        const updated = [deck, ...savedDecks];
        setSavedDecks(updated);
        localStorage.setItem('vitgroww_flashcard_decks', JSON.stringify(updated));
    };

    const loadDeck = (deck: Deck) => {
        setCards(deck.cards);
        setCurrentIndex(0);
        setFlipped(false);
        setShuffled(false);
    };

    const deleteDeck = (id: string) => {
        const updated = savedDecks.filter(d => d.id !== id);
        setSavedDecks(updated);
        localStorage.setItem('vitgroww_flashcard_decks', JSON.stringify(updated));
    };

    const toggleFavorite = (id: string) => {
        const updated = savedDecks.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d);
        const sorted = [...updated].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        setSavedDecks(sorted);
        localStorage.setItem('vitgroww_flashcard_decks', JSON.stringify(sorted));
    };

    const shuffleCards = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setFlipped(false);
        setShuffled(true);
    };

    const markCard = (correct: boolean) => {
        const updated = [...cards];
        updated[currentIndex] = { ...updated[currentIndex], reviewed: true, correct };
        setCards(updated);
        setFlipped(false);
        updateSessionStats(1, correct ? 1 : 0, 0, 0);
        if (currentIndex < cards.length - 1) {
            setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
        }
    };

    const toggleBookmarkCard = () => {
        const updated = [...cards];
        updated[currentIndex] = { ...updated[currentIndex], bookmarked: !updated[currentIndex].bookmarked };
        setCards(updated);
    };

    const toggleBookmarkPoint = (idx: number) => {
        setBookmarkedPoints(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const handleQuizAnswer = (idx: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(idx);
        if (idx === quizQuestions[quizIndex].correct) {
            setQuizScore(quizScore + 1);
        }
    };

    const nextQuizQuestion = () => {
        if (quizIndex < quizQuestions.length - 1) {
            setQuizIndex(quizIndex + 1);
            setSelectedAnswer(null);
        } else {
            setQuizComplete(true);
            updateSessionStats(0, 0, quizScore + (selectedAnswer === quizQuestions[quizIndex].correct ? 1 : 0), quizQuestions.length);
        }
    };

    const copyToClipboard = async (text: string, type: string) => {
        await navigator.clipboard.writeText(text);
        setCopyFeedback(type);
        setTimeout(() => setCopyFeedback(null), 2000);
    };

    const reviewed = cards.filter(c => c.reviewed).length;
    const correctCount = cards.filter(c => c.correct === true).length;
    const bookmarkedCount = cards.filter(c => c.bookmarked).length;

    const getTabColor = (color: string, isActive: boolean) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
            emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
            violet: { bg: 'bg-violet-500/20', border: 'border-violet-500/30', text: 'text-violet-400' }
        };
        return isActive ? colors[color] : { bg: '', border: '', text: 'text-white/40' };
    };

    const tabs = [
        { id: 'flashcards' as const, label: 'Flashcards', icon: Layers, color: 'cyan' },
        { id: 'summary' as const, label: 'Summary', icon: FileText, color: 'emerald' },
        { id: 'quiz' as const, label: 'Quiz', icon: Target, color: 'violet' },
    ];

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-white/10"
                    >
                        <BookOpenCheck size={28} className="text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">AI Study Buddy</h2>
                        <p className="text-white/40 text-sm">Generate flashcards, summaries & quizzes from your notes</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowKeyboardShortcuts(true)}
                        className="p-2.5 bg-white/[0.05] rounded-xl border border-white/[0.06] hover:border-white/10 transition-all"
                        title="Keyboard Shortcuts"
                    >
                        <Keyboard size={18} className="text-white/50" />
                    </motion.button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 rounded-lg border border-violet-500/20">
                        <TrendingUp size={14} className="text-violet-400" />
                        <span className="text-violet-400 text-xs font-medium">{sessionStats.cardsReviewed} cards</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Zap size={14} className="text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-medium">{sessionStats.correctCount} correct</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-white/[0.02] backdrop-blur-md rounded-2xl w-fit flex-shrink-0 border border-white/[0.05]">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const colors = getTabColor(tab.color, isActive);
                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                ? `${colors.bg} ${colors.text} border ${colors.border}`
                                : 'text-white/40 hover:text-white/80 border border-transparent'}`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 flex-shrink-0">
                <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Paste your notes, topic name, or syllabus content here..."
                    className="w-full bg-black/30 border border-white/[0.08] rounded-xl p-4 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 resize-none transition-all"
                    rows={3}
                />
                <div className="flex gap-3 mt-3">
                    <button
                        onClick={activeTab === 'flashcards' ? generateFlashcards : activeTab === 'summary' ? generateSummary : generateQuiz}
                        disabled={!inputText.trim() || generating}
                        className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-cyan-500/20"
                    >
                        {generating ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : <><Sparkles size={18} /> Generate {activeTab === 'flashcards' ? 'Flashcards' : activeTab === 'summary' ? 'Summary' : 'Quiz'}</>}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                <AnimatePresence mode="wait">
                    {/* FLASHCARDS TAB */}
                    {activeTab === 'flashcards' && (
                        <motion.div key="fc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {cards.length === 0 ? (
                                    <div className="bg-white/[0.03] rounded-2xl border border-dashed border-white/[0.08] p-16 text-center">
                                        <Brain size={48} className="text-white/10 mx-auto mb-4" />
                                        <p className="text-white/30 text-sm">Paste your notes above and generate flashcards to start studying</p>
                                        <div className="mt-4 flex justify-center gap-4 text-xs text-white/20">
                                            <span className="flex items-center gap-1"><Keyboard size={12} /> Space to flip</span>
                                            <span className="flex items-center gap-1"><ChevronLeft size={12} /><ChevronRight size={12} /> Navigate</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Progress */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                                <motion.div
                                                    animate={{ width: `${(reviewed / cards.length) * 100}%` }}
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                                />
                                            </div>
                                            <span className="text-white/50 text-xs">{reviewed}/{cards.length}</span>
                                            <span className="text-emerald-400 text-xs font-bold">{correctCount} ✓</span>
                                            {bookmarkedCount > 0 && (
                                                <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                                                    <Bookmark size={10} fill="currentColor" /> {bookmarkedCount}
                                                </span>
                                            )}
                                        </div>

                                        {/* Card */}
                                        <div className="perspective-1000">
                                            <motion.div
                                                onClick={() => setFlipped(!flipped)}
                                                animate={{ rotateY: flipped ? 180 : 0 }}
                                                transition={{ duration: 0.6, type: 'spring' }}
                                                style={{ transformStyle: 'preserve-3d' }}
                                                className="relative w-full h-[280px] cursor-pointer group"
                                            >
                                                {/* Front */}
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                                                    style={{ backfaceVisibility: 'hidden' }}
                                                >
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleBookmarkCard(); }}
                                                            className="p-2 rounded-lg hover:bg-white/5 transition-all"
                                                        >
                                                            <Bookmark
                                                                size={16}
                                                                className={cards[currentIndex]?.bookmarked ? "text-amber-400 fill-amber-400" : "text-white/30"}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(cards[currentIndex]?.front, 'front'); }}
                                                            className="p-2 rounded-lg hover:bg-white/5 transition-all"
                                                        >
                                                            <Copy size={16} className="text-white/30" />
                                                        </button>
                                                    </div>
                                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded-full mb-4">QUESTION · Card {currentIndex + 1}/{cards.length}</span>
                                                    <p className="text-white/90 text-lg font-medium leading-relaxed">{cards[currentIndex]?.front}</p>
                                                    <p className="text-white/20 text-xs mt-4 group-hover:text-cyan-400 transition-colors">Click to flip • Space</p>
                                                </div>
                                                {/* Back */}
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                                >
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(cards[currentIndex]?.back, 'back'); }}
                                                            className="p-2 rounded-lg hover:bg-white/5 transition-all"
                                                        >
                                                            <Copy size={16} className="text-white/30" />
                                                        </button>
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full mb-4">ANSWER</span>
                                                    <p className="text-white/90 text-base leading-relaxed">{cards[currentIndex]?.back}</p>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <span className="text-white/20 text-xs flex items-center gap-1"><Keyboard size={10} /> A - Need Review</span>
                                                        <span className="text-white/20 text-xs flex items-center gap-1"><Keyboard size={10} /> D - Got It</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-center gap-3">
                                            <button onClick={shuffleCards} disabled={shuffled}
                                                className="p-3 bg-white/[0.05] rounded-xl hover:bg-white/[0.08] disabled:opacity-20 transition-all" title="Shuffle"
                                            >
                                                <Shuffle size={18} className="text-white/60" />
                                            </button>
                                            <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); }} disabled={currentIndex === 0}
                                                className="p-3 bg-white/[0.05] rounded-xl hover:bg-white/[0.08] disabled:opacity-20 transition-all"
                                            >
                                                <ChevronLeft size={20} className="text-white/60" />
                                            </button>
                                            <button onClick={() => markCard(false)}
                                                className="px-5 py-3 bg-rose-500/15 text-rose-400 rounded-xl hover:bg-rose-500/25 transition-all flex items-center gap-2"
                                            >
                                                <XCircle size={18} /> Need Review
                                            </button>
                                            <button onClick={() => markCard(true)}
                                                className="px-5 py-3 bg-emerald-500/15 text-emerald-400 rounded-xl hover:bg-emerald-500/25 transition-all flex items-center gap-2"
                                            >
                                                <CheckCircle2 size={18} /> Got It
                                            </button>
                                            <button onClick={() => { setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); setFlipped(false); }} disabled={currentIndex === cards.length - 1}
                                                className="p-3 bg-white/[0.05] rounded-xl hover:bg-white/[0.08] disabled:opacity-20 transition-all"
                                            >
                                                <ChevronRight size={20} className="text-white/60" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Sidebar: Saved Decks */}
                            <div className="space-y-4">
                                {cards.length > 0 && (
                                    <button onClick={saveDeck} className="w-full py-3 bg-white/[0.05] text-white/70 rounded-xl hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 border border-white/[0.06]">
                                        <Save size={16} /> Save Deck
                                    </button>
                                )}
                                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Saved Decks ({savedDecks.length})</h3>
                                    <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                                        {savedDecks.length === 0 ? (
                                            <p className="text-white/20 text-xs text-center py-4">No saved decks</p>
                                        ) : savedDecks.map(deck => (
                                            <div key={deck.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05] group">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0 flex items-center gap-2">
                                                        <button onClick={() => toggleFavorite(deck.id)} className="flex-shrink-0">
                                                            <Star size={14} className={deck.isFavorite ? "text-amber-400 fill-amber-400" : "text-white/20"} />
                                                        </button>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white/70 text-xs font-medium truncate">{deck.name}</p>
                                                            <p className="text-white/30 text-[10px]">{deck.cards.length} cards</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => loadDeck(deck)} className="p-1.5 text-white/40 hover:text-cyan-400"><RefreshCw size={12} /></button>
                                                        <button onClick={() => deleteDeck(deck.id)} className="p-1.5 text-white/40 hover:text-red-400"><Trash2 size={12} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SUMMARY TAB */}
                    {activeTab === 'summary' && (
                        <motion.div key="sum" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">
                            {!summary ? (
                                <div className="bg-white/[0.03] rounded-2xl border border-dashed border-white/[0.08] p-16 text-center">
                                    <Lightbulb size={48} className="text-white/10 mx-auto mb-4" />
                                    <p className="text-white/30 text-sm">Generate a smart summary of your notes</p>
                                    <div className="mt-4 flex justify-center gap-4 text-xs text-white/20">
                                        <span className="flex items-center gap-1"><Bookmark size={12} fill="currentColor" /> Bookmark key points</span>
                                        <span className="flex items-center gap-1"><Copy size={12} /> Copy to clipboard</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{summary.title}</h3>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(summary.title + '\n\n' + summary.points.join('\n'), 'summary')}
                                                className="p-2 rounded-lg hover:bg-white/5 transition-all"
                                            >
                                                <Copy size={16} className={copyFeedback === 'summary' ? "text-emerald-400" : "text-white/30"} />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            {summary.keywords.map((kw, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] rounded-full font-medium">{kw}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                    <div className="space-y-3">
                                        {summary.points.map((point, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -15 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className="flex items-start gap-3 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] group"
                                            >
                                                <button
                                                    onClick={() => toggleBookmarkPoint(i)}
                                                    className="mt-0.5 flex-shrink-0"
                                                >
                                                    <Bookmark
                                                        size={16}
                                                        className={bookmarkedPoints.includes(i) ? "text-amber-400 fill-amber-400" : "text-white/20 group-hover:text-amber-400 transition-colors"}
                                                    />
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm leading-relaxed ${bookmarkedPoints.includes(i) ? 'text-amber-400/80' : 'text-white/80'}`}>{point}</p>
                                                        <button
                                                            onClick={() => copyToClipboard(point, `point-${i}`)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                        >
                                                            <Copy size={14} className="text-white/30" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {bookmarkedPoints.length > 0 && (
                                        <div className="mt-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                                                <Bookmark size={16} fill="currentColor" /> Bookmarked Points ({bookmarkedPoints.length})
                                            </div>
                                            <p className="text-white/50 text-xs">Your bookmarked key points are saved during this session</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* QUIZ TAB */}
                    {activeTab === 'quiz' && (
                        <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-6">
                            {quizQuestions.length === 0 ? (
                                <div className="bg-white/[0.03] rounded-2xl border border-dashed border-white/[0.08] p-16 text-center">
                                    <Target size={48} className="text-white/10 mx-auto mb-4" />
                                    <p className="text-white/30 text-sm">Generate a quiz from your notes to test yourself</p>
                                    <div className="mt-4 flex justify-center gap-4 text-xs text-white/20">
                                        <span className="flex items-center gap-1"><Keyboard size={12} /> 1-4 to answer</span>
                                        <span className="flex items-center gap-1"><Keyboard size={12} /> Enter for next</span>
                                    </div>
                                </div>
                            ) : quizComplete ? (
                                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-10 text-center">
                                    <Award size={64} className="text-violet-400 mx-auto mb-4" />
                                    <h3 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h3>
                                    <p className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent my-4">{quizScore}/{quizQuestions.length}</p>
                                    <p className="text-white/50 mb-6">{quizScore === quizQuestions.length ? 'Perfect score! 🎉' : quizScore >= quizQuestions.length * 0.7 ? 'Great job! 🌟' : 'Keep practicing! 💪'}</p>
                                    <button onClick={() => { setQuizIndex(0); setQuizScore(0); setQuizComplete(false); setSelectedAnswer(null); }}
                                        className="px-6 py-3 bg-violet-500/20 text-violet-400 rounded-xl hover:bg-violet-500/30 transition-all flex items-center gap-2 mx-auto">
                                        <RotateCcw size={16} /> Retry Quiz
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Progress */}
                                    <div className="flex items-center gap-3">
                                        {quizQuestions.map((_, i) => (
                                            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < quizIndex ? 'bg-violet-500' : i === quizIndex ? 'bg-violet-400/50' : 'bg-white/[0.06]'}`} />
                                        ))}
                                    </div>

                                    {/* Question */}
                                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                                        <span className="text-violet-400 text-xs font-bold">Question {quizIndex + 1} of {quizQuestions.length}</span>
                                        <p className="text-white/90 text-lg font-medium mt-3 mb-6">{quizQuestions[quizIndex].question}</p>
                                        <div className="space-y-3">
                                            {quizQuestions[quizIndex].options.map((opt, i) => (
                                                <motion.button key={i} whileHover={selectedAnswer === null ? { scale: 1.01 } : {}} whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                                                    onClick={() => handleQuizAnswer(i)}
                                                    className={`w-full p-4 rounded-xl text-left text-sm transition-all flex items-center gap-3 ${selectedAnswer === null
                                                        ? 'bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 text-white/80'
                                                        : i === quizQuestions[quizIndex].correct
                                                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                                                            : i === selectedAnswer
                                                                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                                                                : 'bg-white/[0.02] border border-white/[0.04] text-white/30'
                                                        }`}>
                                                    <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                        {String.fromCharCode(65 + i)}
                                                    </span>
                                                    {opt}
                                                </motion.button>
                                            ))}
                                        </div>

                                        {selectedAnswer !== null && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                                                <p className="text-white/50 text-xs">{quizQuestions[quizIndex].explanation}</p>
                                                <button onClick={nextQuizQuestion} className="mt-3 px-5 py-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 text-sm transition-all">
                                                    {quizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'See Results'}
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
