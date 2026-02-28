'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Coins, Trophy, Star, X, Gem,
    Dices, Brain, Target, RotateCcw, CheckCircle,
    TrendingUp, PiggyBank, Lightbulb, Zap, BarChart3,
    Award, Flame, ShoppingBag, History, Volume2, VolumeX,
    CandlestickChart
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ==================== UI COMPONENTS ====================

const GlassCard = ({
    children,
    className = '',
    hoverScale = 1.02,
    glowColor = 'rgba(147, 51, 234, 0.3)',
    onClick,
    style
}: any) => (
    <motion.div
        className={`relative overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
        whileHover={onClick ? { scale: hoverScale, boxShadow: `0 20px 40px ${glowColor}` } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
        style={style}
    >
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.6 }} />
        <div className="relative z-10">{children}</div>
    </motion.div>
);

const AnimatedButton = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false }: any) => {
    const variants: any = {
        primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
        outline: 'bg-transparent border border-white/30 text-white hover:bg-white/10',
    };
    const sizes: any = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };

    return (
        <motion.button
            className={`relative overflow-hidden rounded-full font-semibold flex items-center justify-center gap-2 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

// ==================== SOUND SYSTEM ====================
const useSound = () => {
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        setMuted(localStorage.getItem('dhyangyan_muted') === 'true');
    }, []);

    const playSound = useCallback((type: string) => {
        if (muted) return;
        try {
            const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextCtor) return;
            const oscillator = new AudioContextCtor();
            const osc = oscillator.createOscillator();
            const gain = oscillator.createGain();
            osc.connect(gain);
            gain.connect(oscillator.destination);

            if (type === 'win') {
                osc.frequency.setValueAtTime(523.25, oscillator.currentTime);
                osc.frequency.setValueAtTime(659.25, oscillator.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, oscillator.currentTime + 0.2);
                gain.gain.setValueAtTime(0.3, oscillator.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, oscillator.currentTime + 0.5);
                osc.start(oscillator.currentTime);
                osc.stop(oscillator.currentTime + 0.5);
            } else {
                osc.frequency.setValueAtTime(400, oscillator.currentTime);
                gain.gain.setValueAtTime(0.1, oscillator.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, oscillator.currentTime + 0.1);
                osc.start(oscillator.currentTime);
                osc.stop(oscillator.currentTime + 0.1);
            }
        } catch (e) { }
    }, [muted]);

    const toggleMute = () => {
        setMuted(prev => {
            localStorage.setItem('dhyangyan_muted', String(!prev));
            return !prev;
        });
    };

    return { playSound, muted, toggleMute };
};

// ==================== POWER-UPS ====================
const POWER_UPS: any = {
    doubleCoins: { id: 'doubleCoins', name: 'Double Coins', desc: 'Earn 2x coins for 5 minutes', cost: 50, duration: 300000 },
    timeFreeze: { id: 'timeFreeze', name: 'Time Freeze', desc: 'Freeze timers for 15 seconds', cost: 30, duration: 15000 },
    hint: { id: 'hint', name: 'Hint Finder', desc: 'Reveal hidden solutions instantly', cost: 20, uses: 1 },
};

// ==================== GAMES DATA ====================
const GAMES = [
    { id: 'spin', name: 'Lucky Spin', icon: Dices, desc: 'Spin the wheel to win coins & gems', iconColor: 'bg-[#f43f5e]', glowColor: 'rgba(244, 63, 94, 0.4)', category: 'Luck', badgeClass: 'bg-purple-600/60 text-purple-100 placeholder' },
    { id: 'memory', name: 'Memory Match', icon: Brain, desc: 'Match symbols to win rewards', iconColor: 'bg-[#0ea5e9]', glowColor: 'rgba(14, 165, 233, 0.4)', category: 'Skill', badgeClass: 'bg-blue-600/60 text-blue-100 placeholder' },
    { id: 'number', name: 'Number Guess', icon: Target, desc: 'Guess the secret number', iconColor: 'bg-[#10b981]', glowColor: 'rgba(16, 185, 129, 0.4)', category: 'Skill', badgeClass: 'bg-blue-600/60 text-blue-100 placeholder' },
    { id: 'stockmarket', name: 'स्टॉक मार्केट प्रो', icon: CandlestickChart, desc: 'कैंडलस्टिक चार्ट के साथ रीयल-टाइम ट्रेडिंग', iconColor: 'bg-[#8b5cf6]', glowColor: 'rgba(139, 92, 246, 0.4)', category: 'Simulation', badgeClass: 'bg-green-700/60 text-green-100 placeholder' },
    { id: 'investment', name: 'Investment Tycoon', icon: TrendingUp, desc: 'Build your wealth through smart investments', iconColor: 'bg-[#f97316]', glowColor: 'rgba(249, 115, 22, 0.4)', category: 'Simulation', badgeClass: 'bg-green-700/60 text-green-100 placeholder' },
    { id: 'budget', name: 'Budget Master', icon: PiggyBank, desc: 'Master the 50/30/20 budgeting rule', iconColor: 'bg-[#22c55e]', glowColor: 'rgba(34, 197, 94, 0.4)', category: 'Education', badgeClass: 'bg-yellow-700/60 text-yellow-100 placeholder' },
    { id: 'trivia', name: 'Financial Trivia', icon: Lightbulb, desc: 'Test your financial knowledge', iconColor: 'bg-[#eab308]', glowColor: 'rgba(234, 179, 8, 0.4)', category: 'Education', badgeClass: 'bg-yellow-700/60 text-yellow-100 placeholder' },
];

const ACHIEVEMENTS = [
    { id: 'firstWin', name: 'First Steps', desc: 'Win your first game', icon: Trophy, reward: 100 },
    { id: 'lucky', name: 'High Roller', desc: 'Hit a jackpot', icon: Dices, reward: 500 },
    { id: 'investor', name: 'Wolf of Wall St', desc: 'Make massive profits trading', icon: TrendingUp, reward: 400 },
    { id: 'triviaWhiz', name: 'Knowledge is Power', desc: 'Ace a full trivia quiz', icon: Lightbulb, reward: 350 },
];

// ==================== INDIVIDUAL GAMES ====================

const SpinWheel = ({ onWin, onClose, powerUps }: any) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [spinsLeft, setSpinsLeft] = useState(5);
    const multiplier = powerUps.find((p: any) => p.id === 'doubleCoins' && p.active) ? 2 : 1;

    const prizes = [
        { label: '50 Coins', value: 50, type: 'coins', color: '#8B5CF6', icon: Coins },
        { label: '100 XP', value: 100, type: 'xp', color: '#EC4899', icon: Star },
        { label: 'Try Again', value: 0, color: '#6B7280', icon: RotateCcw },
        { label: '200 Coins', value: 200, type: 'coins', color: '#F59E0B', icon: Coins },
        { label: '1 Gem', value: 1, type: 'gem', color: '#3B82F6', icon: Gem },
        { label: 'Jackpot!', value: 500, type: 'coins', color: '#EF4444', icon: Trophy },
        { label: '75 Coins', value: 75, type: 'coins', color: '#10B981', icon: Coins },
        { label: '2x XP Burst', value: 2, type: 'multiplier', color: '#8B5CF6', icon: Target },
    ];

    const spin = () => {
        if (spinning || spinsLeft <= 0) return;
        setSpinning(true);
        setSpinsLeft(prev => prev - 1);
        setResult(null);

        const newRotation = rotation + 1800 + Math.random() * 360;
        setRotation(newRotation);

        setTimeout(() => {
            const actualRotation = newRotation % 360;
            const segmentAngle = 360 / prizes.length;
            const winningIndex = Math.floor((360 - actualRotation + segmentAngle / 2) / segmentAngle) % prizes.length;
            const prize = prizes[winningIndex];
            const multipliedPrize = { ...prize, value: prize.value * (prize.type === 'coins' ? multiplier : 1) };
            setResult(multipliedPrize);
            setSpinning(false);

            if (multipliedPrize.value > 0 && multipliedPrize.type !== 'multiplier') {
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: [multipliedPrize.color, '#FFD700', '#FFA500'] });
                onWin?.(multipliedPrize);
            }
        }, 4000);
    };

    return (
        <div className="text-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-6">
                <motion.div
                    className="absolute inset-0 rounded-full border-8 border-white/20 shadow-2xl overflow-hidden"
                    style={{ background: `conic-gradient(${prizes.map((p, i) => `${p.color} ${i * (360 / prizes.length)}deg ${(i + 1) * (360 / prizes.length)}deg`).join(', ')})` }}
                    animate={{ rotate: rotation }}
                    transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
                >
                    {prizes.map((prize, index) => {
                        const angle = index * (360 / prizes.length) + (360 / prizes.length) / 2;
                        const Icon = prize.icon;
                        return (
                            <div key={index} className="absolute top-1/2 left-1/2 origin-center" style={{ transform: `rotate(${angle}deg) translateY(-110px)` }}>
                                <div className="flex flex-col items-center" style={{ transform: `rotate(${-angle}deg)` }}>
                                    <Icon size={18} className="text-white mb-0.5" />
                                    <span className="text-[10px] font-bold text-white whitespace-nowrap">{prize.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white/20 z-10"><Dices size={28} className="text-white" /></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20"><div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-red-500 drop-shadow-lg" /></div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <p className="text-gray-400 text-xs mb-1">Result:</p>
                        <p className="text-2xl font-bold" style={{ color: result.color }}>{result.label}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-center gap-3">
                <AnimatedButton variant="primary" onClick={spin} disabled={spinning || spinsLeft <= 0}>
                    {spinning ? 'Spinning...' : `Spin (${spinsLeft} left)`}
                </AnimatedButton>
                <AnimatedButton variant="outline" onClick={onClose}><X size={18} /></AnimatedButton>
            </div>
        </div>
    );
};

const MemoryGame = ({ onWin, onClose }: any) => {
    const symbols = ['💰', '💎', '🏦', '📈', '💳', '🪙', '📊', '🎯'];
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const shuffled = [...symbols, ...symbols].sort(() => Math.random() - 0.5).map((s, id) => ({ symbol: s, id }));
        setCards(shuffled);
    }, []);

    const handleCardClick = (index: number) => {
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            if (cards[newFlipped[0]].symbol === cards[newFlipped[1]].symbol) {
                setMatched(prev => [...prev, ...newFlipped]);
                setFlipped([]);
                if (matched.length + 2 === cards.length) {
                    setCompleted(true);
                    onWin?.({ coins: Math.max(50, 200 - moves * 5), xp: 100 });
                    confetti({ particleCount: 200, spread: 120 });
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4 px-3 py-2 bg-white/5 rounded-xl text-sm"><span className="font-bold">Moves: {moves}</span></div>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {cards.map((card, i) => {
                    const isFlipped = flipped.includes(i) || matched.includes(i);
                    return (
                        <motion.button
                            key={card.id} onClick={() => handleCardClick(i)}
                            className={`aspect-square rounded-xl text-3xl font-bold relative ${matched.includes(i) ? 'bg-green-500/30' : isFlipped ? 'bg-white/20' : 'bg-gradient-to-br from-purple-600 to-pink-600'}`}
                            whileHover={{ scale: isFlipped ? 1 : 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                            {isFlipped ? card.symbol : '?'}
                        </motion.button>
                    );
                })}
            </div>
            {completed && <h3 className="text-xl font-bold text-center text-green-400 mb-4">You Won!</h3>}
            <div className="flex justify-center gap-3">
                <AnimatedButton variant="outline" onClick={onClose}><X size={16} /> Close</AnimatedButton>
            </div>
        </div>
    );
};

const NumberGuessGame = ({ onWin, onClose }: any) => {
    const [target] = useState(() => Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState('Guess a number between 1 and 100');
    const [gameOver, setGameOver] = useState(false);

    const handleGuess = () => {
        const num = parseInt(guess);
        if (isNaN(num)) return;
        setAttempts(a => a + 1);
        if (num === target) {
            setFeedback('Exact Match! You Win!');
            setGameOver(true);
            onWin?.({ coins: Math.max(10, 150 - attempts * 15), xp: 50 });
            confetti({ particleCount: 150 });
        } else if (attempts >= 6) {
            setFeedback(`Game Over! It was ${target}`);
            setGameOver(true);
        } else {
            setFeedback(num < target ? 'Too Low! Go higher.' : 'Too High! Go lower.');
        }
        setGuess('');
    };

    return (
        <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">{feedback}</p>
            <p className="text-xs text-gray-500 mb-4">Attempts: {attempts}/7</p>
            {!gameOver ? (
                <>
                    <input type="number" value={guess} onChange={e => setGuess(e.target.value)} placeholder="?" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-2xl font-bold mb-4" />
                    <AnimatedButton className="w-full mb-3" onClick={handleGuess}>Guess</AnimatedButton>
                </>
            ) : (
                <AnimatedButton className="w-full mb-3 text-red-400" onClick={onClose}>Game Ended</AnimatedButton>
            )}
            <AnimatedButton variant="outline" size="sm" onClick={onClose}>Close</AnimatedButton>
        </div>
    );
};

const InvestmentTycoon = ({ onWin, onClose }: any) => {
    const [balance, setBalance] = useState(1000);
    const [portfolio, setPortfolio] = useState({ stocks: 0, gold: 0 });
    const [prices, setPrices] = useState({ stocks: 100, gold: 200 });
    const [day, setDay] = useState(1);
    const maxDays = 15;
    const [gameOver, setGameOver] = useState(false);

    const nextDay = () => {
        if (day >= maxDays) {
            setGameOver(true);
            const total = balance + portfolio.stocks * prices.stocks + portfolio.gold * prices.gold;
            if (total > 1000) {
                onWin?.({ coins: Math.floor((total - 1000) / 2), xp: 200 });
                confetti({ particleCount: 150 });
            }
            return;
        }
        setPrices({
            stocks: Math.max(10, Math.floor(prices.stocks * (1 + (Math.random() - 0.5) * 0.4))),
            gold: Math.max(50, Math.floor(prices.gold * (1 + (Math.random() - 0.5) * 0.15)))
        });
        setDay(d => d + 1);
    };

    const buy = (asset: 'stocks' | 'gold') => {
        if (balance >= prices[asset]) {
            setBalance(b => b - prices[asset]);
            setPortfolio(p => ({ ...p, [asset]: p[asset] + 1 }));
        }
    };
    const sell = (asset: 'stocks' | 'gold') => {
        if (portfolio[asset] > 0) {
            setBalance(b => b + prices[asset]);
            setPortfolio(p => ({ ...p, [asset]: p[asset] - 1 }));
        }
    };

    const totalValue = balance + portfolio.stocks * prices.stocks + portfolio.gold * prices.gold;

    return (
        <div>
            <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-white/5 rounded-xl text-center">
                <div><p className="text-xs text-gray-400">Day</p><p className="font-bold">{day}/{maxDays}</p></div>
                <div><p className="text-xs text-gray-400">Cash</p><p className="font-bold text-green-400">₹{balance}</p></div>
                <div><p className="text-xs text-gray-400">Net Worth</p><p className="font-bold text-yellow-400">₹{totalValue}</p></div>
            </div>
            {!gameOver ? (
                <>
                    {['stocks', 'gold'].map((asset) => (
                        <div key={asset} className="flex justify-between items-center p-3 bg-white/5 rounded-xl mb-2">
                            <div>
                                <p className="font-bold capitalize">{asset}</p>
                                <p className="text-xs text-gray-400">Own: {portfolio[asset as keyof typeof portfolio]}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="font-bold mr-2">₹{prices[asset as keyof typeof prices]}</span>
                                <button onClick={() => sell(asset as any)} className="px-3 py-1 bg-red-500/30 text-red-300 rounded text-xs select-none">Sell</button>
                                <button onClick={() => buy(asset as any)} className="px-3 py-1 bg-green-500/30 text-green-300 rounded text-xs select-none">Buy</button>
                            </div>
                        </div>
                    ))}
                    <AnimatedButton className="w-full mt-4" onClick={nextDay}>Next Day ➔</AnimatedButton>
                </>
            ) : (
                <div className="text-center p-4">
                    <h3 className="text-2xl font-bold mb-2">Game Over</h3>
                    <p className="text-xl mb-4">Final Net Worth: <span className="text-green-400">₹{totalValue}</span></p>
                    <AnimatedButton className="w-full" onClick={onClose} variant="outline">Close Simulator</AnimatedButton>
                </div>
            )}
        </div>
    );
};


// ==================== MAIN PAGE CONTAINER ====================

const DhanGyanGames = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
    const [activePreset, setActivePreset] = useState('Cyberpunk');
    const [activeGame, setActiveGame] = useState<string | null>(null);
    const [totalWinnings, setTotalWinnings] = useState({ coins: 3450, gems: 15 }); // Mock starting balance
    const [showStats, setShowStats] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [activePowerUps, setActivePowerUps] = useState<any[]>([]);

    const { playSound, muted, toggleMute } = useSound();

    const handleWin = (prize: any) => {
        const coins = prize.coins || 0;
        const gems = prize.gems || (prize.type === 'gem' ? (prize.value || 0) : 0);
        setTotalWinnings(prev => ({ coins: prev.coins + coins, gems: prev.gems + gems }));
        playSound('win');
    };

    const buyPowerUp = (id: string) => {
        const pu = POWER_UPS[id];
        if (totalWinnings.coins >= pu.cost) {
            setTotalWinnings(prev => ({ ...prev, coins: prev.coins - pu.cost }));
            setActivePowerUps(prev => [...prev, { ...pu, active: true }]);
            setShowShop(false);
            playSound('win');
        }
    };

    // Generate dynamic gradient background styling based on Preset
    const bgStyles: any = {
        Cyberpunk: 'bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]',
        Midnight: 'bg-[#0f172a] bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#172554]',
        Golden: 'bg-[#1a1c29] bg-gradient-to-br from-[#2a1b10] via-[#3a2c1a] to-[#1a1c29]',
    };

    return (
        <div className={`min-h-screen text-white relative ${bgStyles[activePreset]} overflow-x-hidden transition-colors duration-1000`}>
            {/* Dynamic Background identical to home.tsx style */}
            <div className="fixed inset-0 opacity-40 -z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 80%, rgba(200, 50, 200, 0.25) 0%, transparent 40%), radial-gradient(circle at 90% 40%, rgba(50, 150, 250, 0.25) 0%, transparent 40%)', filter: 'blur(60px)' }} />

            {/* Ambient background lines representing "Hyperspeed" */}
            <div className="fixed inset-0 z-0 pointer-events-none flex justify-center opacity-30">
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent mx-8 transform rotate-12" />
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent mx-8 transform -rotate-[20deg]" />
                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-pink-500/50 to-transparent mx-8 transform rotate-[30deg] relative -top-32" />
            </div>

            {/* Header */}
            <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between p-4 md:p-6 sticky top-0 z-50 backdrop-blur-md bg-transparent">
                <button onClick={() => onNavigate?.('dhangyan')} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-all text-gray-300">
                    <ArrowLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <button onClick={() => setShowShop(!showShop)} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <ShoppingBag size={18} />
                    </button>
                    <button onClick={() => setShowStats(!showStats)} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <BarChart3 size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <Coins size={16} className="text-yellow-400" />
                        <span className="font-bold text-sm tracking-wide text-gray-200">{totalWinnings.coins}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hidden xs:flex">
                        <Gem size={16} className="text-blue-400" />
                        <span className="font-bold text-sm tracking-wide text-gray-200">{totalWinnings.gems}</span>
                    </div>
                </div>
            </motion.header>

            {/* Main Content Area */}
            <div className="px-4 md:px-8 pb-12 pt-4 relative z-10">
                {!activeGame && !showStats && !showShop && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight drop-shadow-lg">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500">Financial </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">Arcade</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">Play games, win rewards, master finance!</p>

                        <div className="flex justify-center gap-3 mt-8">
                            {['Cyberpunk', 'Midnight', 'Golden'].map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => setActivePreset(preset)}
                                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-md ${activePreset === preset ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {showStats ? (
                        <motion.div key="stats" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
                            <GlassCard glowColor="rgba(255,255,255,0.1)">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2"><Trophy className="text-yellow-400" /> Player Profile</h2>
                                    <button onClick={() => setShowStats(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/20"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-green-400">{totalWinnings.coins}</p><p className="text-xs text-gray-400">Total Coins</p></div>
                                    <div className="p-4 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-blue-400">{totalWinnings.gems}</p><p className="text-xs text-gray-400">Total Gems</p></div>
                                    <div className="p-4 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-purple-400">Level 12</p><p className="text-xs text-gray-400">Current XP Rank</p></div>
                                    <div className="p-4 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-orange-400">4 / {ACHIEVEMENTS.length}</p><p className="text-xs text-gray-400">Achievements</p></div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : showShop ? (
                        <motion.div key="shop" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
                            <GlassCard glowColor="rgba(255,255,255,0.1)">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingBag className="text-pink-400" /> Tech Shop</h2>
                                    <button onClick={() => setShowShop(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/20"><X size={20} /></button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {Object.values(POWER_UPS).map((pu: any) => (
                                        <div key={pu.id} className="p-4 bg-black/40 rounded-xl border border-white/10 flex flex-col justify-between">
                                            <div className="mb-4">
                                                <h4 className="font-bold text-lg flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> {pu.name}</h4>
                                                <p className="text-sm text-gray-400 mt-1">{pu.desc}</p>
                                            </div>
                                            <AnimatedButton onClick={() => buyPowerUp(pu.id)} disabled={totalWinnings.coins < pu.cost} variant={totalWinnings.coins >= pu.cost ? 'primary' : 'outline'} className="w-full">
                                                Buy for {pu.cost} 🪙
                                            </AnimatedButton>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ) : !activeGame ? (
                        <motion.div key="menu" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
                            {GAMES.map((game, idx) => {
                                const Icon = game.icon;
                                return (
                                    <GlassCard key={game.id} onClick={() => { setActiveGame(game.id); playSound('click'); }} glowColor={game.glowColor} className="group bg-[#0a0a0f]/80 !p-6 border-white/5">
                                        <div className="flex flex-col h-full">
                                            <div className={`w-14 h-14 rounded-[1rem] ${game.iconColor} flex items-center justify-center mb-5 shadow-inner`}>
                                                <Icon size={26} className="text-white drop-shadow-md" />
                                            </div>
                                            <h3 className="text-[22px] font-bold mb-1.5 tracking-tight text-white group-hover:text-gray-100 transition-colors">{game.name}</h3>
                                            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed flex-grow">{game.desc}</p>
                                            <div className="flex items-center justify-start mt-auto">
                                                <span className={`px-3 py-1 rounded-[6px] text-[13px] font-medium tracking-wide ${game.badgeClass}`}>{game.category}</span>
                                            </div>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div key="game" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
                            <GlassCard glowColor="rgba(255,255,255,0.1)">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        {React.createElement(GAMES.find(g => g.id === activeGame)?.icon || Target, { size: 28, className: "text-purple-400" })}
                                        {GAMES.find(g => g.id === activeGame)?.name}
                                    </h2>
                                </div>
                                {activeGame === 'spin' && <SpinWheel onWin={handleWin} onClose={() => setActiveGame(null)} powerUps={activePowerUps} />}
                                {activeGame === 'memory' && <MemoryGame onWin={handleWin} onClose={() => setActiveGame(null)} />}
                                {activeGame === 'number' && <NumberGuessGame onWin={handleWin} onClose={() => setActiveGame(null)} />}
                                {activeGame === 'stockmarket' && <InvestmentTycoon onWin={handleWin} onClose={() => setActiveGame(null)} />}
                                {activeGame === 'investment' && <InvestmentTycoon onWin={handleWin} onClose={() => setActiveGame(null)} />}
                                {/* Fallbacks for unfinished variants */}
                                {['budget', 'trivia'].includes(activeGame) && (
                                    <div className="text-center py-10">
                                        <Brain size={48} className="mx-auto mb-4 text-gray-500 opacity-50" />
                                        <h3 className="text-xl font-bold text-gray-300 mb-2">Game Module Formatting</h3>
                                        <p className="text-gray-500 mb-6">This challenge is currently being optimized for the new engine.</p>
                                        <AnimatedButton onClick={() => setActiveGame(null)} className="mx-auto">Back to Hub</AnimatedButton>
                                    </div>
                                )}
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DhanGyanGames;
