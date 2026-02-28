import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Coins, Trophy, Star, X, Gem,
  Dices, Brain, Target, RotateCcw, CheckCircle,
  TrendingUp, PiggyBank, Lightbulb, Zap, Timer, BarChart3,
  Award, Flame, ShoppingBag, History, Volume2, VolumeX,
  CandlestickChart
} from 'lucide-react';
import Hyperspeed from '../components/backgrounds/Hyperspeed';
import { AnimatedButton, LanguageSelector } from '../components/ui';
import { MiniHeatmap } from '../components/ui/ContributionHeatmap';
import { useTranslation } from '../i18n';
import RealtimeStockMarket from '../components/gaming/RealtimeStockMarket';
import confetti from 'canvas-confetti';

// ==================== SOUND SYSTEM ====================
const useSound = () => {
  const [muted, setMuted] = useState(() => localStorage.getItem('dhyangyan_muted') === 'true');

  const playSound = useCallback((type) => {
    if (muted) return;
    const audio = new Audio();
    audio.volume = 0.3;
    // Simple synthesized sounds
    const oscillator = new (window.AudioContext || window.webkitAudioContext)();
    if (oscillator) {
      const osc = oscillator.createOscillator();
      const gain = oscillator.createGain();
      osc.connect(gain);
      gain.connect(oscillator.destination);

      if (type === 'win') {
        osc.frequency.setValueAtTime(523.25, oscillator.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, oscillator.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, oscillator.currentTime + 0.2); // G5
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
    }
  }, [muted]);

  const toggleMute = () => {
    setMuted(prev => {
      localStorage.setItem('dhyangyan_muted', !prev);
      return !prev;
    });
  };

  return { playSound, muted, toggleMute };
};

// ==================== HYPERSPEED PRESETS ====================
const hyperspeedPresets = {
  cyberpunk: {
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xffffff,
      brokenLines: 0xffffff,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3
    }
  },
  midnight: {
    distortion: 'mountainDistortion',
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.05, 400 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff102a, 0xeb383e, 0xff102a],
      rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
      sticks: 0xdadafa
    }
  },
  golden: {
    distortion: 'xyDistortion',
    length: 400,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    speedUp: 3,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 30,
    lightStickWidth: [0.02, 0.05],
    lightStickHeight: [0.3, 0.7],
    movingAwaySpeed: [20, 50],
    movingCloserSpeed: [-150, -230],
    carLightsLength: [400 * 0.05, 400 * 0.2],
    carLightsRadius: [0.03, 0.08],
    carWidthPercentage: [0.1, 0.5],
    carShiftX: [-0.5, 0.5],
    carFloorSeparation: [0, 0.1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0x7d0d1b, 0xa90519, 0xff102a],
      rightCars: [0xf1eece, 0xe6e2b1, 0xdfd98a],
      sticks: 0xf1eece
    }
  }
};

// ==================== POWER-UPS ====================
const POWER_UPS = {
  doubleCoins: { id: 'doubleCoins', nameKey: 'powerups.doubleCoins.name', descKey: 'powerups.doubleCoins.description', cost: 50, duration: 300000 },
  timeFreeze: { id: 'timeFreeze', nameKey: 'powerups.timeFreeze.name', descKey: 'powerups.timeFreeze.description', cost: 30, duration: 15000 },
  hint: { id: 'hint', nameKey: 'powerups.hint.name', descKey: 'powerups.hint.description', cost: 20, uses: 1 },
  shield: { id: 'shield', nameKey: 'powerups.shield.name', descKey: 'powerups.shield.description', cost: 40, duration: null },
};

// ==================== GAMES DATA ====================
const getGamesData = (t) => [
  { id: 'spin', name: t('gamesList.spin.name'), icon: Dices, desc: t('gamesList.spin.description'), color: 'from-purple-500 to-pink-500', category: 'luck' },
  { id: 'memory', name: t('gamesList.memory.name'), icon: Brain, desc: t('gamesList.memory.description'), color: 'from-blue-500 to-cyan-500', category: 'skill' },
  { id: 'number', name: t('gamesList.number.name'), icon: Target, desc: t('gamesList.number.description'), color: 'from-green-500 to-emerald-500', category: 'skill' },
  { id: 'stockmarket', name: t('gamesList.stockmarket.name'), icon: CandlestickChart, desc: t('gamesList.stockmarket.description'), color: 'from-indigo-500 to-purple-500', category: 'sim' },
  { id: 'investment', name: t('gamesList.investment.name'), icon: TrendingUp, desc: t('gamesList.investment.description'), color: 'from-orange-500 to-red-500', category: 'sim' },
  { id: 'budget', name: t('gamesList.budget.name'), icon: PiggyBank, desc: t('gamesList.budget.description'), color: 'from-teal-500 to-green-500', category: 'edu' },
  { id: 'trivia', name: t('gamesList.trivia.name'), icon: Lightbulb, desc: t('gamesList.trivia.description'), color: 'from-yellow-500 to-amber-500', category: 'edu' },
];

// ==================== SPIN WHEEL GAME ====================
const SpinWheel = ({ onWin, onClose, powerUps, t }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [spinsLeft, setSpinsLeft] = useState(5);
  const [multiplier, setMultiplier] = useState(1);

  const prizes = [
    { label: t('gamesList.spin.prizes.coins50'), value: 50, type: 'coins', color: '#8B5CF6', icon: Coins },
    { label: t('gamesList.spin.prizes.xp100'), value: 100, type: 'xp', color: '#EC4899', icon: Star },
    { label: t('common.tryAgain'), value: 0, color: '#6B7280', icon: RotateCcw },
    { label: t('gamesList.spin.prizes.coins200'), value: 200, type: 'coins', color: '#F59E0B', icon: Coins },
    { label: t('gamesList.spin.prizes.gem1'), value: 1, type: 'gem', color: '#3B82F6', icon: Gem },
    { label: t('gamesList.spin.prizes.jackpot'), value: 500, type: 'coins', color: '#EF4444', icon: Trophy },
    { label: t('gamesList.spin.prizes.coins75'), value: 75, type: 'coins', color: '#10B981', icon: Coins },
    { label: t('gamesList.spin.prizes.doubleXP'), value: 2, type: 'multiplier', color: '#8B5CF6', icon: Target },
  ];

  useEffect(() => {
    const doubleCoins = powerUps.find(p => p.id === 'doubleCoins' && p.active);
    setMultiplier(doubleCoins ? 2 : 1);
  }, [powerUps]);

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
      <div className="flex justify-center gap-2 mb-4">
        {powerUps.filter(p => p.active).map(powerUp => (
          <motion.div key={powerUp.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-3 py-1 bg-yellow-500/30 rounded-full text-xs font-bold border border-yellow-500/50 flex items-center gap-1">
            <Zap size={12} className="text-yellow-400" />
            {t(powerUp.nameKey)} {t('powerups.active')}
          </motion.div>
        ))}
      </div>

      <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-6">
        <motion.div
          className="absolute inset-0 rounded-full border-8 border-white/20 shadow-2xl"
          style={{ background: `conic-gradient(${prizes.map((p, i) => `${p.color} ${i * (360 / prizes.length)}deg ${(i + 1) * (360 / prizes.length)}deg`).join(', ')})` }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
        >
          {prizes.map((prize, index) => {
            const angle = index * (360 / prizes.length) + (360 / prizes.length) / 2;
            const Icon = prize.icon;
            return (
              <div key={index} className="absolute top-1/2 left-1/2 origin-center" style={{ transform: `rotate(${angle}deg) translateY(-115px)` }}>
                <div className="flex flex-col items-center" style={{ transform: `rotate(${-angle}deg)` }}>
                  <Icon size={18} className="text-white mb-0.5" />
                  <span className="text-[10px] font-bold text-white whitespace-nowrap">{prize.label}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white/20 z-10">
          <Dices size={28} className="text-white" />
        </div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-red-500 drop-shadow-lg" />
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-gray-400 text-xs mb-1">{t('gamesList.spin.youWon')}:</p>
            <p className="text-2xl font-bold" style={{ color: result.color }}>
              {result.label}
              {multiplier > 1 && result.type === 'coins' && <span className="text-sm ml-2 text-yellow-400">(2x!)</span>}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-3">
        <AnimatedButton variant="primary" onClick={spin} disabled={spinning || spinsLeft <= 0}>
          {spinning ? t('gamesList.spin.spinning') : `${t('gamesList.spin.spin')} (${spinsLeft})`}
        </AnimatedButton>
        <AnimatedButton variant="outline" onClick={onClose}>
          <X size={18} />
        </AnimatedButton>
      </div>
    </div>
  );
};

// ==================== MEMORY GAME ====================
const MemoryGame = ({ onWin, onClose, powerUps, t }) => {
  const symbols = ['💰', '💎', '🏦', '📈', '💳', '🪙', '📊', '🎯'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [frozen, setFrozen] = useState(false);
  const [hints, setHints] = useState(0);

  useEffect(() => reset(), []);
  useEffect(() => {
    if (timeLeft > 0 && !gameComplete && !frozen) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameComplete, frozen]);

  useEffect(() => {
    const timeFreeze = powerUps.find(p => p.id === 'timeFreeze' && p.active);
    const hintPowerUp = powerUps.find(p => p.id === 'hint' && p.active);
    if (timeFreeze && !frozen) {
      setFrozen(true);
      setTimeout(() => setFrozen(false), POWER_UPS.timeFreeze.duration);
    }
    if (hintPowerUp) setHints(prev => prev + 1);
  }, [powerUps, frozen]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setGameComplete(true);
          const timeBonus = timeLeft * 3;
          const moveBonus = Math.max(0, (20 - moves) * 10);
          onWin?.({ coins: 100 + timeBonus + moveBonus, xp: 100 });
          confetti({ particleCount: 200, spread: 120 });
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const useHint = () => {
    if (hints <= 0) return;
    setHints(prev => prev - 1);
    const unmatched = cards.map((_, i) => i).filter(i => !matched.includes(i));
    setFlipped(unmatched);
    setTimeout(() => setFlipped([]), 1500);
  };

  const reset = () => {
    const shuffled = [...symbols, ...symbols].sort(() => Math.random() - 0.5).map((symbol, index) => ({ symbol, id: index }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setTimeLeft(60);
    setHints(0);
  };

  return (
    <div>
      <div className="flex justify-between mb-4 px-2 py-2 bg-white/5 rounded-xl">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-purple-400" />
          <span className="text-sm">{t('common.moves')}: {moves}</span>
        </div>
        <div className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
          {frozen ? <span className="text-blue-400">⏸️ {t('gamesList.memory.frozen')}</span> : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        </div>
        <button onClick={useHint} disabled={hints <= 0} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${hints > 0 ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-gray-500'}`}>
          <Lightbulb size={14} /> {t('common.hints')}: {hints}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          const isMatched = matched.includes(index);
          return (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-xl text-2xl relative overflow-hidden ${isMatched ? 'bg-green-500/30 border-2 border-green-500' : isFlipped ? 'bg-white/20 border-2 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white/20'}`}
              whileHover={{ scale: isFlipped ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 flex items-center justify-center">{isFlipped ? card.symbol : '?'}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {gameComplete && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-3 bg-green-500/20 rounded-xl border border-green-500/50 mb-3">
            <Trophy size={32} className="mx-auto mb-1 text-yellow-400" />
            <h3 className="text-lg font-bold">{t('gamesList.memory.excellent')}</h3>
            <p className="text-sm text-gray-300">{t('gamesList.memory.timeBonus')}: {timeLeft * 3} | {t('gamesList.memory.moveBonus')}: {Math.max(0, (20 - moves) * 10)}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-3">
        <AnimatedButton variant="primary" onClick={reset}>
          <RotateCcw size={16} /> {t('common.playAgain')}
        </AnimatedButton>
        <AnimatedButton variant="outline" onClick={onClose}>
          <X size={16} />
        </AnimatedButton>
      </div>
    </div>
  );
};

// ==================== NUMBER GUESS GAME ====================
const NumberGuessGame = ({ onWin, onClose, t }) => {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const maxAttempts = { easy: 10, medium: 7, hard: 5 };

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      setFeedback(t('gamesList.number.enterNumber'));
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setHistory(prev => [...prev, { guess: num, result: num === target ? 'correct' : num < target ? 'low' : 'high' }]);

    if (num === target) {
      const reward = { coins: 100 + (maxAttempts[difficulty] - newAttempts) * 30, xp: 50 + (difficulty === 'hard' ? 50 : difficulty === 'medium' ? 25 : 0) };
      setFeedback(t('gamesList.number.correct'));
      setGameOver(true);
      onWin?.(reward);
      confetti({ particleCount: 100 });
    } else if (newAttempts >= maxAttempts[difficulty]) {
      setFeedback(`${t('gamesList.number.gameOver')} ${t('gamesList.number.theNumberWas')} ${target}`);
      setGameOver(true);
    } else if (num < target) {
      setFeedback(t('gamesList.number.tooLow'));
    } else {
      setFeedback(t('gamesList.number.tooHigh'));
    }
    setGuess('');
  };

  const reset = (newDifficulty = difficulty) => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setGameOver(false);
    setHistory([]);
    setDifficulty(newDifficulty);
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-4">
        {['easy', 'medium', 'hard'].map(diff => (
          <button key={diff} onClick={() => reset(diff)} disabled={attempts > 0}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${difficulty === diff ? diff === 'easy' ? 'bg-green-500 text-white' : diff === 'medium' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'} ${attempts > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {t(`common.${diff}`)} ({maxAttempts[diff]})
          </button>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">{t('gamesList.number.enterNumber')}</p>
        <p className="text-xs text-gray-500">{t('common.attempts')}: {attempts}/{maxAttempts[difficulty]}</p>
      </div>

      {history.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-4 max-h-20 overflow-y-auto">
          {history.map((h, i) => (
            <span key={i} className={`px-2 py-1 rounded text-xs ${h.result === 'correct' ? 'bg-green-500/50' : h.result === 'low' ? 'bg-blue-500/30' : 'bg-red-500/30'}`}>
              {h.guess} {h.result === 'correct' ? '✓' : h.result === 'low' ? '↑' : '↓'}
            </span>
          ))}
        </div>
      )}

      {!gameOver ? (
        <>
          <div className="flex gap-2 mb-4">
            <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleGuess()} placeholder="?"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-2xl font-bold" min="1" max="100" />
          </div>
          <AnimatedButton variant="primary" onClick={handleGuess} className="w-full mb-3">{t('gamesList.number.guess')}</AnimatedButton>
        </>
      ) : (
        <AnimatedButton variant="primary" onClick={() => reset()} className="w-full mb-3">
          <RotateCcw size={16} /> {t('common.playAgain')}
        </AnimatedButton>
      )}

      {feedback && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-medium mb-3">{feedback}</motion.p>}
      <AnimatedButton variant="outline" onClick={onClose} size="sm">{t('common.close')}</AnimatedButton>
    </div>
  );
};

// ==================== INVESTMENT TYCOON GAME ====================
const InvestmentTycoon = ({ onWin, onClose, t }) => {
  const [balance, setBalance] = useState(1000);
  const [portfolio, setPortfolio] = useState({ stocks: 0, crypto: 0, gold: 0 });
  const [prices, setPrices] = useState({ stocks: 100, crypto: 50, gold: 200 });
  const [day, setDay] = useState(1);
  const maxDays = 30;
  const [news, setNews] = useState(t('gamesList.investment.marketOpens'));
  const [gameOver, setGameOver] = useState(false);

  const assets = [
    { id: 'stocks', name: t('gamesList.investment.assets.stocks'), icon: '📈', volatility: 0.15 },
    { id: 'crypto', name: t('gamesList.investment.assets.crypto'), icon: '₿', volatility: 0.3 },
    { id: 'gold', name: t('gamesList.investment.assets.gold'), icon: '🥇', volatility: 0.05 },
  ];

  const events = [
    t('gamesList.investment.events.stable'), t('gamesList.investment.events.techBoom'),
    t('gamesList.investment.events.cryptoSurge'), t('gamesList.investment.events.goldRises'),
    t('gamesList.investment.events.correction'), t('gamesList.investment.events.techCrash'),
    t('gamesList.investment.events.cryptoDips'), t('gamesList.investment.events.goldShines')
  ];

  const nextDay = () => {
    const newPrices = {};
    assets.forEach(asset => {
      const change = (Math.random() - 0.5) * 2 * asset.volatility;
      newPrices[asset.id] = Math.max(10, Math.round(prices[asset.id] * (1 + change)));
    });
    setPrices(newPrices);
    setNews(events[Math.floor(Math.random() * events.length)]);

    if (day >= maxDays) {
      setGameOver(true);
      const totalValue = balance + portfolio.stocks * newPrices.stocks + portfolio.crypto * newPrices.crypto + portfolio.gold * newPrices.gold;
      onWin?.({ coins: Math.max(50, (totalValue - 1000) / 5), xp: totalValue - 1000 > 500 ? 200 : 100 });
      confetti({ particleCount: totalValue > 1000 ? 150 : 50 });
    } else {
      setDay(d => d + 1);
    }
  };

  const buy = (assetId) => {
    if (balance >= prices[assetId]) {
      setBalance(b => b - prices[assetId]);
      setPortfolio(p => ({ ...p, [assetId]: p[assetId] + 1 }));
    }
  };

  const sell = (assetId) => {
    if (portfolio[assetId] > 0) {
      setBalance(b => b + prices[assetId]);
      setPortfolio(p => ({ ...p, [assetId]: p[assetId] - 1 }));
    }
  };

  const totalValue = balance + portfolio.stocks * prices.stocks + portfolio.crypto * prices.crypto + portfolio.gold * prices.gold;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-white/5 rounded-xl">
        <div className="text-center"><p className="text-xs text-gray-400">{t('gamesList.investment.day')}</p><p className="text-lg font-bold">{day}/{maxDays}</p></div>
        <div className="text-center"><p className="text-xs text-gray-400">{t('common.cash')}</p><p className="text-lg font-bold text-green-400">₹{balance}</p></div>
        <div className="text-center"><p className="text-xs text-gray-400">{t('common.total')}</p><p className="text-lg font-bold text-yellow-400">₹{totalValue}</p></div>
      </div>

      <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4 text-sm text-center">📰 {news}</div>

      {!gameOver ? (
        <>
          <div className="space-y-2 mb-4">
            {assets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{asset.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-gray-400">{t('common.own')}: {portfolio[asset.id]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{prices[asset.id]}</span>
                  <button onClick={() => sell(asset.id)} disabled={portfolio[asset.id] === 0} className="px-3 py-1 bg-red-500/30 text-red-300 rounded-lg text-xs disabled:opacity-30">{t('common.sell')}</button>
                  <button onClick={() => buy(asset.id)} disabled={balance < prices[asset.id]} className="px-3 py-1 bg-green-500/30 text-green-300 rounded-lg text-xs disabled:opacity-30">{t('common.buy')}</button>
                </div>
              </div>
            ))}
          </div>
          <AnimatedButton variant="primary" onClick={nextDay} className="w-full mb-3">{t('common.next')} →</AnimatedButton>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/50 mb-4">
          <Trophy size={40} className="mx-auto mb-2 text-yellow-400" />
          <h3 className="text-xl font-bold mb-1">{t('gamesList.investment.gameComplete')}</h3>
          <p className="text-2xl font-bold text-green-400">+₹{totalValue - 1000}</p>
          <p className="text-sm text-gray-400 mt-2">{t('gamesList.investment.finalValue')}</p>
        </motion.div>
      )}

      <div className="flex justify-center gap-2">
        {!gameOver && <AnimatedButton variant="outline" onClick={() => setGameOver(true)}>{t('gamesList.investment.endEarly')}</AnimatedButton>}
        <AnimatedButton variant="outline" onClick={onClose}><X size={16} /></AnimatedButton>
      </div>
    </div>
  );
};

// ==================== BUDGET MASTER GAME ====================
const BudgetMaster = ({ onWin, onClose, t }) => {
  const [budget, setBudget] = useState(5000);
  const [spent, setSpent] = useState({ needs: 0, wants: 0, savings: 0 });
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState(false);

  const levels = [
    { name: 'College Student', budget: 5000, targetNeeds: 0.5, targetWants: 0.3, targetSavings: 0.2 },
    { name: 'Young Professional', budget: 25000, targetNeeds: 0.5, targetWants: 0.25, targetSavings: 0.25 },
    { name: 'Family Budget', budget: 75000, targetNeeds: 0.6, targetWants: 0.2, targetSavings: 0.2 },
  ];

  const expenses = [
    { id: 1, name: t('gamesList.budget.categories.rent'), cost: 15000, category: 'needs' },
    { id: 2, name: t('gamesList.budget.categories.groceries'), cost: 5000, category: 'needs' },
    { id: 3, name: t('gamesList.budget.categories.utilities'), cost: 2000, category: 'needs' },
    { id: 4, name: t('gamesList.budget.categories.netflix'), cost: 500, category: 'wants' },
    { id: 5, name: t('gamesList.budget.categories.dining'), cost: 3000, category: 'wants' },
    { id: 6, name: t('gamesList.budget.categories.shopping'), cost: 5000, category: 'wants' },
    { id: 7, name: t('gamesList.budget.categories.emergency'), cost: 5000, category: 'savings' },
    { id: 8, name: t('gamesList.budget.categories.investments'), cost: 10000, category: 'savings' },
  ];

  const currentLevel = levels[level - 1];
  const remaining = budget - Object.values(spent).reduce((a, b) => a + b, 0);

  const addExpense = (expense) => {
    if (remaining >= expense.cost && !completed) {
      setSpent(s => ({ ...s, [expense.category]: s[expense.category] + expense.cost }));
    }
  };

  const checkBudget = () => {
    const total = budget;
    const needsRatio = spent.needs / total;
    const wantsRatio = spent.wants / total;
    const savingsRatio = spent.savings / total;
    const needsOK = Math.abs(needsRatio - currentLevel.targetNeeds) <= 0.1;
    const wantsOK = Math.abs(wantsRatio - currentLevel.targetWants) <= 0.1;
    const savingsOK = Math.abs(savingsRatio - currentLevel.targetSavings) <= 0.1;

    if (needsOK && wantsOK && savingsOK) {
      setCompleted(true);
      onWin?.({ coins: 200 * level, xp: 150 });
      confetti({ particleCount: 100 });
    } else {
      alert(t('gamesList.budget.notBalanced'));
    }
  };

  const nextLevel = () => {
    if (level < levels.length) {
      setLevel(l => l + 1);
      setBudget(levels[level].budget);
      setSpent({ needs: 0, wants: 0, savings: 0 });
      setCompleted(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs font-bold">{t('gamesList.budget.level')} {level}: {currentLevel.name}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-white/5 rounded-xl text-center text-xs">
        <div><p className="text-gray-400">{t('gamesList.budget.budget')}</p><p className="font-bold text-green-400">₹{budget}</p></div>
        <div><p className="text-blue-400">{t('gamesList.budget.needs')} {Math.round(currentLevel.targetNeeds * 100)}%</p><p className="font-bold">₹{spent.needs}</p></div>
        <div><p className="text-purple-400">{t('gamesList.budget.wants')} {Math.round(currentLevel.targetWants * 100)}%</p><p className="font-bold">₹{spent.wants}</p></div>
        <div><p className="text-yellow-400">{t('gamesList.budget.savings')} {Math.round(currentLevel.targetSavings * 100)}%</p><p className="font-bold">₹{spent.savings}</p></div>
      </div>

      <p className="text-center text-sm mb-3">{t('gamesList.budget.remaining')}: <span className={`font-bold ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>₹{remaining}</span></p>

      {!completed ? (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {expenses.map(exp => (
              <button key={exp.id} onClick={() => addExpense(exp)} disabled={remaining < exp.cost}
                className="p-2 bg-white/10 rounded-lg text-left text-xs hover:bg-white/20 disabled:opacity-30 transition-colors">
                <span className="font-medium">{exp.name}</span>
                <span className="block text-gray-400">₹{exp.cost} • {t(`gamesList.budget.${exp.category}`)}</span>
              </button>
            ))}
          </div>
          <AnimatedButton variant="primary" onClick={checkBudget} className="w-full mb-3">{t('gamesList.budget.checkBudget')}</AnimatedButton>
        </>
      ) : (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/50 mb-4">
          <CheckCircle size={40} className="mx-auto mb-2 text-green-400" />
          <h3 className="text-lg font-bold">{t('gamesList.budget.perfectBudget')}</h3>
          {level < levels.length ? (
            <AnimatedButton variant="primary" onClick={nextLevel} className="mt-3">{t('common.next')} →</AnimatedButton>
          ) : (
            <p className="text-sm text-gray-400">{t('gamesList.budget.allLevelsComplete')} 🎉</p>
          )}
        </motion.div>
      )}
      <AnimatedButton variant="outline" onClick={onClose} size="sm">{t('common.close')}</AnimatedButton>
    </div>
  );
};

// ==================== FINANCIAL TRIVIA GAME ====================
const FinancialTrivia = ({ onWin, onClose, t }) => {
  const questions = [
    { q: t('gamesList.trivia.questions.q1.q'), options: t('gamesList.trivia.questions.q1.options'), correct: 0, xp: 30 },
    { q: t('gamesList.trivia.questions.q2.q'), options: t('gamesList.trivia.questions.q2.options'), correct: 0, xp: 25 },
    { q: t('gamesList.trivia.questions.q3.q'), options: t('gamesList.trivia.questions.q3.options'), correct: 1, xp: 20 },
    { q: t('gamesList.trivia.questions.q4.q'), options: t('gamesList.trivia.questions.q4.options'), correct: 1, xp: 35 },
    { q: t('gamesList.trivia.questions.q5.q'), options: t('gamesList.trivia.questions.q5.options'), correct: 0, xp: 30 },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  const answer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].correct;
    if (correct) {
      setScore(s => s + questions[current].xp + streak * 5);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setAnswered(false);
        setSelected(null);
      } else {
        onWin?.({ coins: score * 2, xp: score });
        confetti({ particleCount: score > 100 ? 150 : 80 });
      }
    }, 1500);
  };

  if (current >= questions.length) {
    return (
      <div className="text-center">
        <Trophy size={48} className="mx-auto mb-3 text-yellow-400" />
        <h3 className="text-2xl font-bold mb-2">{t('gamesList.trivia.quizComplete')}</h3>
        <p className="text-3xl font-bold text-green-400 mb-1">{score} {t('common.xp')}</p>
        <p className="text-sm text-gray-400 mb-4">{t('gamesList.trivia.finalScore')}</p>
        <AnimatedButton variant="primary" onClick={() => { setCurrent(0); setScore(0); setStreak(0); }}>{t('common.playAgain')}</AnimatedButton>
        <AnimatedButton variant="outline" onClick={onClose} size="sm" className="ml-2">{t('common.close')}</AnimatedButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">{t('gamesList.trivia.question')} {current + 1}/{questions.length}</span>
        <div className="flex items-center gap-1">
          <Flame size={16} className="text-orange-400" />
          <span className="text-sm font-bold">{streak}x</span>
        </div>
        <span className="text-sm font-bold text-green-400">{score} {t('common.xp')}</span>
      </div>

      <div className="p-4 bg-white/5 rounded-xl mb-4">
        <p className="text-lg font-medium mb-1">{questions[current].q}</p>
        <p className="text-xs text-gray-400">{t('common.worth')} {questions[current].xp} {t('common.xp')}</p>
      </div>

      <div className="space-y-2 mb-4">
        {questions[current].options.map((opt, idx) => (
          <button key={idx} onClick={() => answer(idx)} disabled={answered}
            className={`w-full p-3 rounded-xl text-left text-sm transition-all ${answered
                ? idx === questions[current].correct ? 'bg-green-500/30 border border-green-500' : idx === selected ? 'bg-red-500/30 border border-red-500' : 'bg-white/5'
                : 'bg-white/10 hover:bg-white/20'
              }`}>
            {opt}
            {answered && idx === questions[current].correct && <CheckCircle size={16} className="inline ml-2 text-green-400" />}
          </button>
        ))}
      </div>

      {answered && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-gray-400">{selected === questions[current].correct ? t('gamesList.trivia.correct') : t('gamesList.trivia.wrong')}</motion.div>}
    </div>
  );
};

// ==================== ACHIEVEMENTS DATA ====================
const getAchievementsData = (t) => [
  { id: 'firstWin', name: t('achievements.firstWin.name'), desc: t('achievements.firstWin.description'), icon: Trophy, reward: 100 },
  { id: 'lucky', name: t('achievements.lucky.name'), desc: t('achievements.lucky.description'), icon: Dices, reward: 500 },
  { id: 'memoryMaster', name: t('achievements.memoryMaster.name'), desc: t('achievements.memoryMaster.description'), icon: Brain, reward: 300 },
  { id: 'investor', name: t('achievements.investor.name'), desc: t('achievements.investor.description'), icon: TrendingUp, reward: 400 },
  { id: 'budgetPro', name: t('achievements.budgetPro.name'), desc: t('achievements.budgetPro.description'), icon: PiggyBank, reward: 500 },
  { id: 'triviaWhiz', name: t('achievements.triviaWhiz.name'), desc: t('achievements.triviaWhiz.description'), icon: Lightbulb, reward: 350 },
  { id: 'streak5', name: t('achievements.streak5.name'), desc: t('achievements.streak5.description'), icon: Flame, reward: 250 },
  { id: 'rich', name: t('achievements.rich.name'), desc: t('achievements.rich.description'), icon: Coins, reward: 1000 },
];

// ==================== MAIN GAMES PAGE ====================
const GamesPage = ({ user, onClose }) => {
  const { t, language, changeLanguage } = useTranslation();
  const [activeGame, setActiveGame] = useState(null);
  const [currentPreset, setCurrentPreset] = useState('cyberpunk');
  const [totalWinnings, setTotalWinnings] = useState({ coins: 0, gems: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activePowerUps, setActivePowerUps] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [activeTab, setActiveTab] = useState('games');
  const { playSound, muted, toggleMute } = useSound();

  // Generate gaming activity data for heatmap
  const [gameActivity] = useState(() => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0
      });
    }
    return data.reverse();
  });

  const games = getGamesData(t);
  const ACHIEVEMENTS = getAchievementsData(t);

  const presets = [
    { id: 'cyberpunk', name: t('presets.cyberpunk'), color: 'from-pink-500 to-purple-500' },
    { id: 'midnight', name: t('presets.midnight'), color: 'from-blue-500 to-indigo-500' },
    { id: 'golden', name: t('presets.golden'), color: 'from-yellow-500 to-orange-500' },
  ];

  const buyPowerUp = (powerUpId) => {
    const powerUp = POWER_UPS[powerUpId];
    if (totalWinnings.coins >= powerUp.cost) {
      setTotalWinnings(prev => ({ ...prev, coins: prev.coins - powerUp.cost }));
      setActivePowerUps(prev => [...prev, { ...powerUp, name: t(powerUp.nameKey), active: true, expires: Date.now() + (powerUp.duration || 0) }]);
      playSound('click');
    }
  };

  const handleWin = (prize) => {
    const coins = prize.coins || 0;
    const gems = prize.gems || (prize.type === 'gem' ? (prize.value || 0) : 0);
    setTotalWinnings(prev => ({ coins: prev.coins + coins, gems: prev.gems + gems }));
    setGameHistory(prev => [...prev, { game: activeGame, reward: prize, time: Date.now() }]);
    setGamesPlayed(prev => prev + 1);
    checkAchievements({ coins, gems, game: activeGame, prize });
    playSound('win');
  };

  const checkAchievements = (data) => {
    const newAchievements = [];
    ACHIEVEMENTS.forEach(ach => {
      if (achievements.includes(ach.id)) return;
      let earned = false;
      if (ach.id === 'firstWin' && gamesPlayed === 0) earned = true;
      if (ach.id === 'lucky' && data.game === 'spin' && data.prize?.label?.includes('Jackpot')) earned = true;
      if (ach.id === 'investor' && data.game === 'investment' && data.prize?.profit >= 1000) earned = true;
      if (ach.id === 'triviaWhiz' && data.game === 'trivia' && data.prize?.xp >= 150) earned = true;
      if (ach.id === 'rich' && totalWinnings.coins + data.coins >= 5000) earned = true;

      if (earned) {
        newAchievements.push(ach.id);
        setTotalWinnings(prev => ({ ...prev, coins: prev.coins + ach.reward }));
        confetti({ particleCount: 100, colors: ['#FFD700'] });
      }
    });
    if (newAchievements.length > 0) setAchievements(prev => [...prev, ...newAchievements]);
  };

  const renderStats = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-blue-400" /> {t('stats.title')}</h2>
        <button onClick={() => setShowStats(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-400">{totalWinnings.coins}</p>
          <p className="text-xs text-gray-400">{t('stats.totalCoins')}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl text-center">
          <p className="text-2xl font-bold text-blue-400">{totalWinnings.gems}</p>
          <p className="text-xs text-gray-400">{t('stats.totalGems')}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-400">{gamesPlayed}</p>
          <p className="text-xs text-gray-400">{t('stats.gamesPlayed')}</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl text-center">
          <p className="text-2xl font-bold text-yellow-400">{achievements.length}/{ACHIEVEMENTS.length}</p>
          <p className="text-xs text-gray-400">{t('stats.achievementsUnlocked')}</p>
        </div>
      </div>
      {gameHistory.length > 0 && (
        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2"><History size={18} /> {t('stats.recentGames')}</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {gameHistory.slice(-10).reverse().map((game, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg text-sm">
                <span>{games.find(g => g.id === game.game)?.name || game.game}</span>
                <span className="text-green-400">+{game.reward.coins || 0} 🪙</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderAchievements = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="text-yellow-400" /> {t('achievements.title')}</h2>
        <button onClick={() => setShowAchievements(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
      </div>
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {ACHIEVEMENTS.map(ach => {
          const Icon = ach.icon;
          const earned = achievements.includes(ach.id);
          return (
            <div key={ach.id} className={`flex items-center gap-3 p-3 rounded-xl ${earned ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-white/5 border border-white/10'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${earned ? 'bg-yellow-500/30' : 'bg-white/10'}`}>
                <Icon size={24} className={earned ? 'text-yellow-400' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${earned ? 'text-white' : 'text-gray-400'}`}>{ach.name}</h4>
                <p className="text-xs text-gray-400">{ach.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-yellow-400 font-bold">+{ach.reward}</p>
                {earned && <CheckCircle size={16} className="text-green-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderShop = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingBag className="text-purple-400" /> {t('powerups.title')}</h2>
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-bold">{totalWinnings.coins} 🪙</span>
          <button onClick={() => setActiveTab('games')} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
        </div>
      </div>
      <div className="grid gap-3">
        {Object.values(POWER_UPS).map(powerUp => {
          const canAfford = totalWinnings.coins >= powerUp.cost;
          return (
            <div key={powerUp.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Zap size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">{t(powerUp.nameKey)}</p>
                  <p className="text-xs text-gray-400">{t(powerUp.descKey)}</p>
                </div>
              </div>
              <button onClick={() => buyPowerUp(powerUp.id)} disabled={!canAfford}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${canAfford ? 'bg-green-500/30 text-green-300 hover:bg-green-500/50' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}>
                {powerUp.cost} 🪙
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="hyperspeed-container">
      <div className="absolute inset-0">
        <Hyperspeed effectOptions={hyperspeedPresets[currentPreset]} />
      </div>
      <div className="hyperspeed-overlay" />

      <div className="hyperspeed-content">
        <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between p-4 md:p-6">
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">{t('common.back')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button onClick={() => setActiveTab('shop')} className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
              <ShoppingBag size={18} />
            </button>
            <button onClick={() => setShowStats(true)} className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
              <BarChart3 size={18} />
            </button>
            <button onClick={() => setShowAchievements(true)} className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
              <Award size={18} />
            </button>
            <LanguageSelector />
          </div>

          <div className="flex items-center gap-3">
            {/* Mini Streak Heatmap */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Flame size={16} className="text-orange-400" />
              <MiniHeatmap data={gameActivity} colorScheme="orange" days={30} />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
              <Coins size={16} className="text-yellow-400" />
              <span className="font-bold text-sm">{totalWinnings.coins}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30">
              <Gem size={16} className="text-blue-400" />
              <span className="font-bold text-sm">{totalWinnings.gems}</span>
            </div>
          </div>
        </motion.header>

        <div className="px-4 md:px-8 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400">{t('games.title')}</span>
            </h1>
            <p className="text-gray-400">{t('games.subtitle')}</p>
          </motion.div>

          {showStats ? renderStats() : showAchievements ? renderAchievements() : activeTab === 'shop' ? renderShop() : (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center gap-2 mb-8 flex-wrap">
                {presets.map(preset => (
                  <button key={preset.id} onClick={() => setCurrentPreset(preset.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentPreset === preset.id ? `bg-gradient-to-r ${preset.color} text-white` : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                    {preset.name}
                  </button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                {!activeGame ? (
                  <motion.div key="menu" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {games.map((game, index) => {
                      const Icon = game.icon;
                      return (
                        <motion.button key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} onClick={() => { setActiveGame(game.id); playSound('click'); }}
                          className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all text-left group">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow`}>
                            <Icon size={24} className="text-white" />
                          </div>
                          <h3 className="text-lg font-bold mb-1">{game.name}</h3>
                          <p className="text-xs text-gray-400">{game.desc}</p>
                          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] category-${game.category}`}>
                            {t(`games.gameCategories.${game.category}`)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div key="game" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-md mx-auto">
                    <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{games.find(g => g.id === activeGame)?.name}</h2>
                        <button onClick={() => setActiveGame(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
                      </div>
                      {activeGame === 'spin' && <SpinWheel onWin={handleWin} onClose={() => setActiveGame(null)} powerUps={activePowerUps} t={t} />}
                      {activeGame === 'memory' && <MemoryGame onWin={handleWin} onClose={() => setActiveGame(null)} powerUps={activePowerUps} t={t} />}
                      {activeGame === 'number' && <NumberGuessGame onWin={handleWin} onClose={() => setActiveGame(null)} t={t} />}
                      {activeGame === 'investment' && <InvestmentTycoon onWin={handleWin} onClose={() => setActiveGame(null)} t={t} />}
                      {activeGame === 'budget' && <BudgetMaster onWin={handleWin} onClose={() => setActiveGame(null)} t={t} />}
                      {activeGame === 'trivia' && <FinancialTrivia onWin={handleWin} onClose={() => setActiveGame(null)} t={t} />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== EXPORT ====================
export default GamesPage;
