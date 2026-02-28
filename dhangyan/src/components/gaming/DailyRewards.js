import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Coins, Gem, Star, Check, Lock, Sparkles, X } from 'lucide-react';
import { AnimatedButton } from '../ui';
import confetti from 'canvas-confetti';

const weekRewards = [
  { day: 1, reward: { coins: 50 }, icon: Coins, claimed: true },
  { day: 2, reward: { coins: 100 }, icon: Coins, claimed: true },
  { day: 3, reward: { coins: 150, xp: 50 }, icon: Star, claimed: false, current: true },
  { day: 4, reward: { coins: 200 }, icon: Coins, claimed: false },
  { day: 5, reward: { coins: 250, gems: 1 }, icon: Gem, claimed: false },
  { day: 6, reward: { coins: 300 }, icon: Coins, claimed: false },
  { day: 7, reward: { coins: 1000, gems: 5, special: 'Mystery Box' }, icon: Gift, claimed: false, jackpot: true },
];

const DailyRewards = ({ user, onClose, onClaim }) => {
  const [rewards, setRewards] = useState(weekRewards);
  const [claiming, setClaiming] = useState(false);
  const [justClaimed, setJustClaimed] = useState(null);
  const [streak, setStreak] = useState(user?.streak || 5);

  const handleClaim = async (dayIndex) => {
    const reward = rewards[dayIndex];
    if (reward.claimed || (!reward.current && !reward.claimed)) return;

    setClaiming(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRewards(prev => prev.map((r, i) => 
      i === dayIndex ? { ...r, claimed: true, current: false } : r
    ));
    
    setJustClaimed(reward);
    setClaiming(false);
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#8B5CF6']
    });

    onClaim?.(reward.reward);

    // Set next day as current
    if (dayIndex < rewards.length - 1) {
      setTimeout(() => {
        setRewards(prev => prev.map((r, i) => 
          i === dayIndex + 1 ? { ...r, current: true } : r
        ));
      }, 2000);
    }

    setTimeout(() => setJustClaimed(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50, rotateX: 30 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.9, y: 50, rotateX: -30 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                y: [0, -500],
                x: [0, (Math.random() - 0.5) * 200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                bottom: -10,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
              <Gift size={48} className="text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400">
            Daily Rewards
          </h2>
          <p className="text-gray-300">
            Come back every day for amazing rewards!
          </p>
          
          {/* Streak Counter */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
            <div className="flex">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={i < streak ? { scale: 0 } : { scale: 1 }}
                  animate={i < streak ? { scale: 1 } : { scale: 1 }}
                  className={`w-3 h-3 rounded-full mx-0.5 ${
                    i < streak ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {streak} Day Streak! 🔥
            </span>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="relative grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
          {rewards.map((reward, index) => {
            const Icon = reward.icon;
            const isToday = reward.current;
            const isClaimed = reward.claimed;
            const isLocked = !isClaimed && !isToday;

            return (
              <motion.button
                key={reward.day}
                whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={() => handleClaim(index)}
                disabled={isLocked || claiming}
                className={`
                  relative aspect-square rounded-2xl p-2 flex flex-col items-center justify-center
                  transition-all duration-300
                  ${isToday 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 ring-4 ring-yellow-400/50 shadow-lg shadow-yellow-500/30' 
                    : isClaimed
                      ? 'bg-green-500/20 border-2 border-green-500/50'
                      : reward.jackpot
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400'
                        : 'bg-white/5 border-2 border-white/10'
                  }
                  ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Day Number */}
                <span className={`text-xs font-bold mb-1 ${
                  isToday ? 'text-white' : isClaimed ? 'text-green-400' : 'text-gray-400'
                }`}>
                  Day {reward.day}
                </span>

                {/* Icon */}
                <div className="relative">
                  <Icon size={24} className={isToday ? 'text-white' : isClaimed ? 'text-green-400' : 'text-gray-300'} />
                  
                  {/* Sparkle Animation for Today */}
                  {isToday && !claiming && (
                    <motion.div
                      className="absolute -inset-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      {[...Array(4)].map((_, i) => (
                        <Sparkles
                          key={i}
                          size={8}
                          className="absolute text-yellow-300"
                          style={{
                            top: i < 2 ? -4 : 'auto',
                            bottom: i >= 2 ? -4 : 'auto',
                            left: i % 2 === 0 ? -4 : 'auto',
                            right: i % 2 === 1 ? -4 : 'auto',
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Reward Amount */}
                <div className={`text-xs font-bold mt-1 ${
                  isToday ? 'text-white' : isClaimed ? 'text-green-400' : 'text-gray-300'
                }`}>
                  {reward.reward.coins && (
                    <span>{reward.reward.coins}</span>
                  )}
                  {reward.reward.gems && (
                    <span className="text-blue-300 ml-1">+{reward.reward.gems}💎</span>
                  )}
                </div>

                {/* Status */}
                {isClaimed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl"
                  >
                    <Check size={32} className="text-green-400" />
                  </motion.div>
                )}

                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                    <Lock size={20} className="text-gray-500" />
                  </div>
                )}

                {/* Jackpot Badge */}
                {reward.jackpot && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-[10px] font-bold">
                    JACKPOT
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Claim Button */}
        {rewards.some(r => r.current) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              onClick={() => handleClaim(rewards.findIndex(r => r.current))}
              loading={claiming}
              className="min-w-[200px]"
            >
              {claiming ? 'Claiming...' : 'Claim Today\'s Reward!'}
            </AnimatedButton>
          </motion.div>
        )}

        {/* Next Reward Timer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Next reward in: <span className="text-white font-mono">12:34:56</span>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-2xl"
        >
          ×
        </button>

        {/* Success Notification */}
        <AnimatePresence>
          {justClaimed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-2xl shadow-2xl text-center"
            >
              <Sparkles size={32} className="mx-auto mb-2 text-white" />
              <p className="text-xl font-bold text-white">Reward Claimed!</p>
              <p className="text-white/90">
                +{justClaimed.reward.coins} coins
                {justClaimed.reward.gems && ` +${justClaimed.reward.gems} gems`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DailyRewards;
