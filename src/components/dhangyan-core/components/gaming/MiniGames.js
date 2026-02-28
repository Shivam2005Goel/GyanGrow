import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dices, RotateCcw, Gift, Star, Trophy, X, 
  Coins, Sparkles, Target, Brain
} from 'lucide-react';
import { AnimatedButton } from '../ui';
import confetti from 'canvas-confetti';

// Lucky Spin Wheel Game
const SpinWheel = ({ onClose, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [spinsLeft, setSpinsLeft] = useState(3);

  const prizes = [
    { label: '50 Coins', value: 50, color: '#8B5CF6', icon: Coins },
    { label: '100 XP', value: 100, type: 'xp', color: '#EC4899', icon: Star },
    { label: 'Try Again', value: 0, color: '#6B7280', icon: RotateCcw },
    { label: '200 Coins', value: 200, color: '#F59E0B', icon: Coins },
    { label: '1 Gem', value: 1, type: 'gem', color: '#3B82F6', icon: Sparkles },
    { label: 'Jackpot!', value: 1000, color: '#EF4444', icon: Trophy },
    { label: '75 Coins', value: 75, color: '#10B981', icon: Coins },
    { label: '2x XP', value: 2, type: 'multiplier', color: '#8B5CF6', icon: Target },
  ];

  const spin = () => {
    if (spinning || spinsLeft <= 0) return;
    
    setSpinning(true);
    setSpinsLeft(prev => prev - 1);
    
    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);
    
    setTimeout(() => {
      const actualRotation = newRotation % 360;
      const segmentAngle = 360 / prizes.length;
      const winningIndex = Math.floor((360 - actualRotation + segmentAngle / 2) / segmentAngle) % prizes.length;
      
      const prize = prizes[winningIndex];
      setResult(prize);
      setSpinning(false);
      
      if (prize.value > 0) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: [prize.color, '#FFD700', '#FFA500']
        });
        onWin?.(prize);
      }
    }, 4000);
  };

  const reset = () => {
    setResult(null);
    setRotation(0);
  };

  return (
    <div className="text-center">
      <div className="relative w-80 h-80 mx-auto mb-8">
        {/* Wheel Container */}
        <motion.div
          className="absolute inset-0 rounded-full border-8 border-white/20 shadow-2xl"
          style={{
            background: `conic-gradient(${prizes.map((p, i) => 
              `${p.color} ${i * (360 / prizes.length)}deg ${(i + 1) * (360 / prizes.length)}deg`
            ).join(', ')})`,
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
        >
          {/* Prize Labels */}
          {prizes.map((prize, index) => {
            const angle = index * (360 / prizes.length) + (360 / prizes.length) / 2;
            const Icon = prize.icon;
            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 origin-center"
                style={{
                  transform: `rotate(${angle}deg) translateY(-130px)`,
                }}
              >
                <div className="flex flex-col items-center" style={{ transform: `rotate(${-angle}deg)` }}>
                  <Icon size={20} className="text-white mb-1" />
                  <span className="text-xs font-bold text-white whitespace-nowrap">
                    {prize.label}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white/20 z-10">
          <Dices size={32} className="text-white" />
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
        </div>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20"
          >
            <p className="text-gray-400 text-sm mb-1">You won:</p>
            <p className="text-3xl font-bold" style={{ color: result.color }}>
              {result.label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <AnimatedButton
          variant="primary"
          onClick={spin}
          disabled={spinning || spinsLeft <= 0}
          className="min-w-[120px]"
        >
          {spinning ? 'Spinning...' : `Spin (${spinsLeft} left)`}
        </AnimatedButton>
        {result && (
          <AnimatedButton variant="outline" onClick={reset}>
            <RotateCcw size={18} />
          </AnimatedButton>
        )}
      </div>
    </div>
  );
};

// Memory Cards Game
const MemoryGame = ({ onClose, onWin }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const symbols = [
    { icon: '💰', name: 'Money' },
    { icon: '💎', name: 'Diamond' },
    { icon: '🏦', name: 'Bank' },
    { icon: '📈', name: 'Growth' },
    { icon: '💳', name: 'Card' },
    { icon: '🪙', name: 'Coin' },
    { icon: '📊', name: 'Chart' },
    { icon: '🎯', name: 'Target' },
  ];

  useEffect(() => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ ...symbol, id: index }));
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameComplete]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].name === cards[second].name) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setGameComplete(true);
          const reward = { coins: Math.max(50, timeLeft * 2), xp: 100 };
          onWin?.(reward);
          confetti({ particleCount: 200, spread: 120 });
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const reset = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ ...symbol, id: index }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setTimeLeft(60);
  };

  return (
    <div>
      {/* Stats */}
      <div className="flex justify-between mb-4 px-4">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-purple-400" />
          <span>Moves: {moves}</span>
        </div>
        <div className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          const isMatched = matched.includes(index);
          
          return (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`
                aspect-square rounded-xl text-3xl relative overflow-hidden
                ${isMatched 
                  ? 'bg-green-500/30 border-2 border-green-500' 
                  : isFlipped
                    ? 'bg-white/20 border-2 border-purple-500'
                    : 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white/20'
                }
              `}
              whileHover={{ scale: isFlipped ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
              >
                {isFlipped ? card.icon : '?'}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Game Over */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/50 mb-4"
          >
            <Trophy size={40} className="mx-auto mb-2 text-yellow-400" />
            <h3 className="text-xl font-bold mb-1">Excellent Memory!</h3>
            <p className="text-gray-300">You earned {Math.max(50, timeLeft * 2)} coins & 100 XP!</p>
          </motion.div>
        )}
        
        {timeLeft === 0 && !gameComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-red-500/20 rounded-xl border border-red-500/50 mb-4"
          >
            <h3 className="text-xl font-bold mb-1">Time's Up!</h3>
            <p className="text-gray-300">Don't give up! Try again.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-4">
        <AnimatedButton variant="primary" onClick={reset}>
          <RotateCcw size={18} /> Play Again
        </AnimatedButton>
      </div>
    </div>
  );
};

// Main Mini Games Component
const MiniGames = ({ user, onClose }) => {
  const [activeGame, setActiveGame] = useState('menu');
  const [lastWin, setLastWin] = useState(null);

  const games = [
    { 
      id: 'spin', 
      name: 'Lucky Spin', 
      icon: Dices, 
      color: 'from-purple-500 to-pink-500',
      description: 'Spin the wheel to win coins, XP, and gems!'
    },
    { 
      id: 'memory', 
      name: 'Memory Match', 
      icon: Brain, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Match financial symbols to train your brain!'
    },
  ];

  const handleWin = (prize) => {
    setLastWin(prize);
    setTimeout(() => setLastWin(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-6 border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <Gift size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Mini Games</h2>
              <p className="text-gray-400 text-sm">Play games to earn rewards!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Game Menu */}
        {activeGame === 'menu' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <motion.button
                  key={game.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveGame(game.id)}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-400">{game.description}</p>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveGame('menu')}
              className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-1"
            >
              ← Back to Games
            </button>
            
            {activeGame === 'spin' && <SpinWheel onClose={onClose} onWin={handleWin} />}
            {activeGame === 'memory' && <MemoryGame onClose={onClose} onWin={handleWin} />}
          </div>
        )}

        {/* Win Notification */}
        <AnimatePresence>
          {lastWin && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <Sparkles size={20} />
              <span className="font-bold">You won {lastWin.label}!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MiniGames;
