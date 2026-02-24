'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    RotateCcw,
    Shuffle,
    ChevronLeft,
    ChevronRight,
    Brain,
    CheckCircle,
    X,
    BookOpen,
    Target,
    Zap
} from 'lucide-react';

interface Flashcard {
    id: string;
    front: string;
    back: string;
    category: string;
}

interface Deck {
    id: string;
    name: string;
    cards: Flashcard[];
    color: string;
}

const deckColors = [
    'from-rose-500 to-orange-500',
    'from-amber-500 to-yellow-500',
    'from-emerald-500 to-teal-500',
    'from-cyan-500 to-blue-500',
    'from-indigo-500 to-purple-500',
    'from-violet-500 to-pink-500',
];

export default function FlashcardMaker() {
    const [decks, setDecks] = useState<Deck[]>([
        {
            id: '1',
            name: 'Data Structures',
            cards: [
                { id: '1', front: 'What is a Binary Search Tree?', back: 'A binary tree where left child < parent < right child, enabling O(log n) search.', category: 'Trees' },
                { id: '2', front: 'Time complexity of QuickSort?', back: 'O(n log n) average, O(n²) worst case.', category: 'Sorting' },
                { id: '3', front: 'What is Hashing?', back: 'Converting keys to array indices using hash functions for O(1) average access.', category: 'Hashing' },
            ],
            color: deckColors[3],
        },
        {
            id: '2',
            name: 'Machine Learning',
            cards: [
                { id: '4', front: 'What is Overfitting?', back: 'When model learns training data too well, including noise, reducing generalization.', category: 'Concepts' },
                { id: '5', front: 'What is Gradient Descent?', back: 'Optimization algorithm that iteratively moves toward minimum of loss function.', category: 'Algorithms' },
            ],
            color: deckColors[4],
        },
    ]);

    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [newCard, setNewCard] = useState({ front: '', back: '', category: '' });
    const [studyMode, setStudyMode] = useState(false);
    const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

    const createDeck = () => {
        if (!newDeckName.trim()) return;
        const newDeck: Deck = {
            id: Date.now().toString(),
            name: newDeckName,
            cards: [],
            color: deckColors[Math.floor(Math.random() * deckColors.length)],
        };
        setDecks([...decks, newDeck]);
        setNewDeckName('');
        setShowCreateModal(false);
    };

    const addCardToDeck = (deckId: string) => {
        if (!newCard.front.trim() || !newCard.back.trim()) return;
        setDecks(decks.map(deck => {
            if (deck.id === deckId) {
                return {
                    ...deck,
                    cards: [...deck.cards, {
                        id: Date.now().toString(),
                        front: newCard.front,
                        back: newCard.back,
                        category: newCard.category || 'General',
                    }],
                };
            }
            return deck;
        }));
        setNewCard({ front: '', back: '', category: '' });
    };

    const deleteCard = (deckId: string, cardId: string) => {
        setDecks(decks.map(deck => {
            if (deck.id === deckId) {
                return { ...deck, cards: deck.cards.filter(c => c.id !== cardId) };
            }
            return deck;
        }));
    };

    const deleteDeck = (deckId: string) => {
        setDecks(decks.filter(d => d.id !== deckId));
        if (selectedDeck?.id === deckId) {
            setSelectedDeck(null);
            setStudyMode(false);
        }
    };

    const shuffleCards = () => {
        if (!selectedDeck) return;
        const shuffled = [...selectedDeck.cards].sort(() => Math.random() - 0.5);
        setSelectedDeck({ ...selectedDeck, cards: shuffled });
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setKnownCards(new Set());
    };

    const nextCard = () => {
        if (selectedDeck && currentCardIndex < selectedDeck.cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };

    const markAsKnown = () => {
        if (selectedDeck) {
            const cardId = selectedDeck.cards[currentCardIndex].id;
            setKnownCards(new Set([...knownCards, cardId]));
            nextCard();
        }
    };

    const resetStudy = () => {
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setKnownCards(new Set());
    };

    if (studyMode && selectedDeck) {
        const currentCard = selectedDeck.cards[currentCardIndex];
        const progress = ((currentCardIndex + 1) / selectedDeck.cards.length) * 100;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setStudyMode(false); setIsFlipped(false); }}
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-white/90">{selectedDeck.name}</h2>
                            <p className="text-sm text-white/40">{currentCardIndex + 1} / {selectedDeck.cards.length} cards</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={shuffleCards}
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 transition-colors"
                        >
                            <Shuffle size={18} />
                        </button>
                        <button
                            onClick={resetStudy}
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 transition-colors"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full bg-gradient-to-r ${selectedDeck.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                {/* Card */}
                <div className="flex justify-center py-8">
                    <div
                        className="relative w-full max-w-xl cursor-pointer perspective-1000"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentCard.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full min-h-[320px]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div
                                    className={`absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${isFlipped
                                        ? 'bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border-cyan-500/30'
                                        : `bg-gradient-to-br ${selectedDeck.color} border-white/10`
                                        }`}
                                    style={{
                                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        backfaceVisibility: 'hidden',
                                    }}
                                >
                                    {!isFlipped && (
                                        <>
                                            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
                                                {currentCard.category}
                                            </span>
                                            <div className="text-2xl font-bold text-white mb-4">{currentCard.front}</div>
                                            <p className="text-white/50 text-sm">Click to reveal</p>
                                        </>
                                    )}
                                </div>

                                {/* Back of card */}
                                <div
                                    className={`absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10`}
                                    style={{
                                        transform: 'rotateY(180deg)',
                                        backfaceVisibility: 'hidden',
                                    }}
                                >
                                    <div className="text-white/40 text-sm mb-2">Answer</div>
                                    <div className="text-lg font-medium text-white/90">{currentCard.back}</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={prevCard}
                        disabled={currentCardIndex === 0}
                        className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={markAsKnown}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                    >
                        <CheckCircle size={20} />
                        <span>Got it!</span>
                    </button>

                    <button
                        onClick={nextCard}
                        disabled={currentCardIndex === selectedDeck.cards.length - 1}
                        className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-6 pt-4">
                    <div className="flex items-center gap-2 text-white/40">
                        <Brain size={16} />
                        <span className="text-sm">{knownCards.size} mastered</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                        <Target size={16} />
                        <span className="text-sm">{selectedDeck.cards.length - knownCards.size} remaining</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative rounded-3xl p-2 sm:p-0">
            {/* Ambient Background Glows */}
            <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-20 left-1/4 w-[350px] h-[350px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="relative z-10 flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <BookOpen className="text-cyan-400" size={28} />
                        Flashcard Maker
                    </h2>
                    <p className="text-sm text-white/50 mt-1">Create and study flashcards for effective learning</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all border border-white/10"
                >
                    <Plus size={18} />
                    <span>New Deck</span>
                </motion.button>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-3 gap-4 relative z-10">
                {[
                    { label: 'Total Decks', value: decks.length, icon: BookOpen, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/20' },
                    { label: 'Total Cards', value: decks.reduce((acc, d) => acc + d.cards.length, 0), icon: Brain, color: 'text-violet-400', bg: 'from-violet-500/20 to-pink-500/20' },
                    { label: 'XP Potential', value: decks.reduce((acc, d) => acc + d.cards.length, 0) * 5, icon: Zap, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-500/20' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/[0.05] hover:border-white/[0.15] rounded-2xl p-5 overflow-hidden transition-all duration-300 shadow-xl"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center border border-white/5 shadow-inner`}>
                                <stat.icon size={22} className={stat.color} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                                <p className="text-xs font-medium text-white/50">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Decks grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10 mt-4">
                {decks.map((deck) => (
                    <div
                        key={deck.id}
                        className="group relative bg-[#0a0f1c]/70 backdrop-blur-xl border border-white/[0.05] hover:border-white/[0.15] rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-xl overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${deck.color} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-700 pointer-events-none`} />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${deck.color} flex items-center justify-center shadow-lg border border-white/10`}
                            >
                                <Brain size={26} className="text-white drop-shadow-md" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => deleteDeck(deck.id)}
                                    className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500/30 transition-all font-semibold"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white/95 mb-1 tracking-tight">{deck.name}</h3>
                        <div className="flex items-center gap-2 mb-6 text-sm text-white/50">
                            <BookOpen size={14} className="text-cyan-400/70" />
                            <span className="font-medium text-white/60">{deck.cards.length} cards</span>
                        </div>

                        {deck.cards.length > 0 ? (
                            <div className="flex gap-3 relative z-10">
                                <button
                                    onClick={() => { setSelectedDeck(deck); setStudyMode(true); resetStudy(); }}
                                    className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 font-bold transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] text-sm"
                                >
                                    Study Now
                                </button>
                                <button
                                    onClick={() => setSelectedDeck(deck)}
                                    className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/5 hover:border-white/10 text-white/60 font-medium text-sm transition-all"
                                >
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-white/30 italic mt-2">Add cards to start studying</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Add card form when deck is selected */}
            {selectedDeck && !studyMode && (
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 relative z-10">
                    <h3 className="text-lg font-bold text-white/90 mb-4">Add Card to {selectedDeck.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Question (Front)"
                            value={newCard.front}
                            onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                            className="px-4 py-3 rounded-xl bg-[#040812] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                        />
                        <input
                            type="text"
                            placeholder="Answer (Back)"
                            value={newCard.back}
                            onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                            className="px-4 py-3 rounded-xl bg-[#040812] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Category"
                                value={newCard.category}
                                onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-xl bg-[#040812] border border-white/[0.06] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                            />
                            <button
                                onClick={() => addCardToDeck(selectedDeck.id)}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-400 transition-colors border border-cyan-500/30 hover:border-cyan-500/50 shadow-inner"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Existing cards */}
                    {selectedDeck.cards.length > 0 && (
                        <div className="mt-6 space-y-2">
                            <p className="text-sm text-white/40 mb-3">Cards in this deck:</p>
                            {selectedDeck.cards.map((card) => (
                                <div key={card.id} className="flex items-center justify-between p-4 rounded-xl bg-[#040812] border border-white/[0.04]">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white/80 truncate mb-1">{card.front}</p>
                                        <p className="text-xs text-white/40 truncate bg-white/5 py-1 px-2 rounded-md inline-block">{card.back}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/5 text-xs font-semibold text-white/40 tracking-wider uppercase">{card.category}</span>
                                        <button
                                            onClick={() => deleteCard(selectedDeck.id, card.id)}
                                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create Deck Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-5 right-5 p-2 rounded-xl hover:bg-white/5 text-white/40 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Create New Deck</h3>
                            <input
                                type="text"
                                placeholder="Enter deck name"
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 mb-6 transition-all"
                            />
                            <button
                                onClick={createDeck}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold tracking-wide hover:opacity-90 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
                            >
                                Create Deck
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
