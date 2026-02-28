import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Zap, Target, Flame, Trophy, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

const XPDisplay = ({ user, showLevelUp, onLevelUpComplete }) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [displayXP, setDisplayXP] = useState(user?.xp || 0);
  const [prevLevel, setPrevLevel] = useState(user?.level || 1);

  useEffect(() => {
    if (showLevelUp && !isLevelingUp) {
      triggerLevelUp();
    }
  }, [showLevelUp]);

  const triggerLevelUp = () => {
    setIsLevelingUp(true);
    
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    setTimeout(() => {
      setIsLevelingUp(false);
      setPrevLevel(user?.level || 1);
      onLevelUpComplete?.();
    }, 4000);
  };

  const xpForNextLevel = (user?.level || 1) * 1000;
  const xpProgress = ((user?.xp || 0) / xpForNextLevel) * 100;

  return (
    <>
      {/* XP Bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-500/20 rounded-lg">
              <Star size={16} className="text-yellow-400" />
            </div>
            <span className="text-sm font-medium">Level {user?.level || 1}</span>
          </div>
          <span className="text-xs text-gray-400">
            {user?.xp || 0} / {xpForNextLevel} XP
          </span>
        </div>
        
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Level Up Modal */}
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              {/* Animated Level Badge */}
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1, 1.2, 1]
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative inline-block mb-6"
              >
                <motion.div
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/50"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(251, 191, 36, 0.5)',
                      '0 0 60px rgba(251, 191, 36, 0.8)',
                      '0 0 20px rgba(251, 191, 36, 0.5)'
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Crown size={64} className="text-white" />
                </motion.div>
                
                {/* Orbiting particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.1,
                    }}
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: `${60 + i * 5}px center`,
                    }}
                  />
                ))}
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"
              >
                LEVEL UP!
              </motion.h2>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-2xl text-white mb-2">
                  You are now Level <span className="text-yellow-400 font-bold">{user?.level || 1}</span>
                </p>
                <p className="text-gray-400">Keep up the amazing work!</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex justify-center gap-4"
              >
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">+100</div>
                  <div className="text-xs text-gray-400">Coins</div>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">+1</div>
                  <div className="text-xs text-gray-400">Gem</div>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">+50</div>
                  <div className="text-xs text-gray-400">Max Energy</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const CompactXPDisplay = ({ user }) => {
  const xpForNextLevel = (user?.level || 1) * 1000;
  const xpProgress = ((user?.xp || 0) / xpForNextLevel) * 100;

  return (
    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{user?.level || 1}</span>
        </div>
        <motion.div
          className="absolute -inset-1 rounded-full border-2 border-yellow-400"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Level {user?.level || 1}</span>
          <span className="text-yellow-400">{Math.round(xpProgress)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden w-32">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default XPDisplay;
