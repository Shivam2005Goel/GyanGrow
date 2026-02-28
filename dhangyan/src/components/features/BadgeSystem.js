import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  Crown,
  Diamond,
  Medal,
  Flame,
  Sparkles,
  Lock,
  CheckCircle,
  X
} from 'lucide-react';
import { GlassCard, ProgressBar } from '../ui';

const badges = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: Star,
    color: 'yellow',
    requirement: 1,
    type: 'lessons',
  },
  {
    id: 'savings_master',
    name: 'Savings Master',
    description: 'Save ₹10,000 in your virtual wallet',
    icon: Trophy,
    color: 'green',
    requirement: 10000,
    type: 'savings',
  },
  {
    id: 'quiz_champion',
    name: 'Quiz Champion',
    description: 'Score 100% in 5 quizzes',
    icon: Target,
    color: 'purple',
    requirement: 5,
    type: 'perfect_quizzes',
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    icon: Flame,
    color: 'orange',
    requirement: 7,
    type: 'streak',
  },
  {
    id: 'investment_guru',
    name: 'Investment Guru',
    description: 'Complete all investment courses',
    icon: Zap,
    color: 'blue',
    requirement: 5,
    type: 'investment_courses',
  },
  {
    id: 'community_leader',
    name: 'Community Leader',
    description: 'Help 10 other learners',
    icon: Crown,
    color: 'pink',
    requirement: 10,
    type: 'helped_users',
  },
  {
    id: 'financial_wizard',
    name: 'Financial Wizard',
    description: 'Reach level 50',
    icon: Diamond,
    color: 'purple',
    requirement: 50,
    type: 'level',
  },
  {
    id: 'legendary',
    name: 'Legendary',
    description: 'Earn all other badges',
    icon: Medal,
    color: 'yellow',
    requirement: 7,
    type: 'total_badges',
  },
];

const userStats = {
  lessons: 3,
  savings: 5000,
  perfect_quizzes: 2,
  streak: 4,
  investment_courses: 2,
  helped_users: 5,
  level: 25,
  total_badges: 3,
};

const BadgeCard = ({ badge, progress, isUnlocked, onClick }) => {
  const Icon = badge.icon;
  const colorClasses = {
    yellow: 'from-yellow-500/20 to-orange-500/20 text-yellow-400',
    green: 'from-green-500/20 to-emerald-500/20 text-green-400',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-400',
    orange: 'from-orange-500/20 to-red-500/20 text-orange-400',
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    pink: 'from-pink-500/20 to-rose-500/20 text-pink-400',
  };

  return (
    <motion.div
      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
      whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
      onClick={() => onClick && onClick(badge)}
      className={`
        relative overflow-hidden rounded-xl p-4 cursor-pointer
        ${isUnlocked 
          ? 'bg-gradient-to-br ' + colorClasses[badge.color]
          : 'bg-gray-800/50 grayscale opacity-60'
        }
        border border-white/10 transition-all duration-300
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          p-3 rounded-lg ${isUnlocked ? 'bg-white/10' : 'bg-gray-700'}
        `}>
          {isUnlocked ? (
            <Icon size={24} />
          ) : (
            <Lock size={24} className="text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{badge.name}</h3>
          <p className="text-sm text-gray-300 mt-1">{badge.description}</p>
          
          {!isUnlocked && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-300">{progress} / {badge.requirement}</span>
              </div>
              <ProgressBar 
                progress={(progress / badge.requirement) * 100} 
                color="gray"
                className="h-1"
              />
            </div>
          )}
        </div>
      </div>
      
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2"
        >
          <Sparkles size={16} className="text-yellow-400" />
        </motion.div>
      )}
    </motion.div>
  );
};

const BadgeDetailModal = ({ badge, progress, isUnlocked, onClose }) => {
  if (!badge) return null;
  const Icon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 border border-white/20"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`
              inline-flex p-6 rounded-2xl mb-4
              ${isUnlocked 
                ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-yellow-400'
                : 'bg-gray-800 text-gray-500'
              }
            `}
          >
            <Icon size={48} />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">{badge.name}</h2>
          <p className="text-gray-300 mb-6">{badge.description}</p>

          {isUnlocked ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle size={20} />
              <span className="font-semibold">Unlocked!</span>
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Progress</span>
                <span className="text-white">{progress} / {badge.requirement}</span>
              </div>
              <ProgressBar 
                progress={(progress / badge.requirement) * 100} 
                color="purple"
              />
              <p className="text-sm text-gray-400 mt-3">
                Complete {badge.requirement - progress} more to unlock!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BadgeSystem = ({ onClose }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState('all');

  const unlockedBadges = badges.filter(badge => 
    userStats[badge.type] >= badge.requirement
  );

  const filteredBadges = badges.filter(badge => {
    if (filter === 'unlocked') return userStats[badge.type] >= badge.requirement;
    if (filter === 'locked') return userStats[badge.type] < badge.requirement;
    return true;
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="w-full max-w-4xl max-h-[90vh] bg-gray-900/95 rounded-2xl p-6 border border-white/10 shadow-2xl overflow-y-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Award className="text-yellow-400" />
                Your Badges
              </h2>
              <p className="text-gray-400 mt-1">
                {unlockedBadges.length} of {badges.length} badges earned
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-white/10 rounded-lg p-1">
                {['all', 'unlocked', 'locked'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-sm capitalize transition-all ${
                      filter === f ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          <GlassCard className="mb-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(unlockedBadges.length / badges.length) * 251.2} 251.2`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {Math.round((unlockedBadges.length / badges.length) * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Keep it up!</h3>
                <p className="text-gray-300">
                  You've earned {unlockedBadges.length} badges. 
                  Complete more challenges to unlock the rest!
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  progress={userStats[badge.type] || 0}
                  isUnlocked={userStats[badge.type] >= badge.requirement}
                  onClick={setSelectedBadge}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailModal
            badge={selectedBadge}
            progress={userStats[selectedBadge.type] || 0}
            isUnlocked={userStats[selectedBadge.type] >= selectedBadge.requirement}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BadgeSystem;
