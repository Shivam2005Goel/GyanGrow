import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Clock, Gift, CheckCircle, Lock, Star,
  TrendingUp, BookOpen, Zap, Award, Flame, Crown
} from 'lucide-react';
import { GlassCard, AnimatedButton, ProgressBar } from '../ui';
import confetti from 'canvas-confetti';

// Calendar SVG Component - must be defined before questTypes
const Calendar = ({ size, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const questTypes = {
  daily: { name: 'Daily Quests', icon: Clock, color: 'blue' },
  weekly: { name: 'Weekly Missions', icon: Calendar, color: 'purple' },
  achievement: { name: 'Achievements', icon: Award, color: 'yellow' },
  special: { name: 'Special Events', icon: Star, color: 'pink' },
};

const mockQuests = [
  {
    id: 1,
    title: 'Budget Master',
    description: 'Create a monthly budget plan',
    type: 'daily',
    reward: { coins: 100, xp: 50 },
    progress: 0,
    total: 1,
    difficulty: 'easy',
    timeLeft: '8 hours',
  },
  {
    id: 2,
    title: 'Savings Streak',
    description: 'Save ₹500 in your virtual wallet',
    type: 'daily',
    reward: { coins: 150, xp: 75 },
    progress: 300,
    total: 500,
    difficulty: 'medium',
    timeLeft: '8 hours',
  },
  {
    id: 3,
    title: 'Knowledge Seeker',
    description: 'Complete 3 lessons today',
    type: 'daily',
    reward: { coins: 200, xp: 100 },
    progress: 2,
    total: 3,
    difficulty: 'medium',
    timeLeft: '8 hours',
  },
  {
    id: 4,
    title: 'Quiz Champion',
    description: 'Score 90%+ in 5 quizzes',
    type: 'weekly',
    reward: { coins: 500, xp: 250, gems: 2 },
    progress: 3,
    total: 5,
    difficulty: 'hard',
    timeLeft: '3 days',
  },
  {
    id: 5,
    title: 'Investment Guru',
    description: 'Complete Investment 101 course',
    type: 'weekly',
    reward: { coins: 1000, xp: 500, gems: 5 },
    progress: 0,
    total: 1,
    difficulty: 'legendary',
    timeLeft: '3 days',
  },
  {
    id: 6,
    title: 'First Steps',
    description: 'Complete your first lesson',
    type: 'achievement',
    reward: { coins: 50, xp: 25 },
    progress: 1,
    total: 1,
    difficulty: 'easy',
    completed: true,
  },
  {
    id: 7,
    title: '7-Day Streak',
    description: 'Maintain a 7-day learning streak',
    type: 'achievement',
    reward: { coins: 500, xp: 250, gems: 3 },
    progress: 5,
    total: 7,
    difficulty: 'hard',
  },
  {
    id: 8,
    title: 'Republic Day Special',
    description: 'Complete the India Economy Quiz',
    type: 'special',
    reward: { coins: 1000, xp: 500, gems: 10 },
    progress: 0,
    total: 1,
    difficulty: 'legendary',
    timeLeft: '2 days',
    event: true,
  },
];

const difficultyColors = {
  easy: 'from-green-400 to-emerald-500',
  medium: 'from-blue-400 to-cyan-500',
  hard: 'from-purple-400 to-pink-500',
  legendary: 'from-yellow-400 to-orange-500',
};

const difficultyStars = {
  easy: 1,
  medium: 2,
  hard: 3,
  legendary: 5,
};

const QuestCard = React.forwardRef(({ quest, onClaim }, ref) => {
  const isCompleted = quest.progress >= quest.total;
  const progressPercent = (quest.progress / quest.total) * 100;
  const typeInfo = questTypes[quest.type];
  const TypeIcon = typeInfo?.icon || Target;

  const handleClaim = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347']
    });
    onClaim?.(quest);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative p-5 rounded-2xl border transition-all
        ${quest.completed
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
        }
        ${quest.event ? 'ring-2 ring-yellow-500/50' : ''}
      `}
    >
      {/* Event Badge */}
      {quest.event && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
          <Star size={12} /> LIMITED EVENT
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          p-3 rounded-xl flex-shrink-0
          bg-gradient-to-br ${quest.completed ? 'from-green-500 to-emerald-600' : 'from-gray-700 to-gray-800'}
        `}>
          {quest.completed ? (
            <CheckCircle size={24} className="text-white" />
          ) : (
            <TypeIcon size={24} className="text-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg truncate">{quest.title}</h3>
            {/* Difficulty Stars */}
            <div className="flex">
              {[...Array(difficultyStars[quest.difficulty])].map((_, i) => (
                <Star key={i} size={12} className="text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-3">{quest.description}</p>

          {/* Progress */}
          {!quest.completed && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{quest.progress} / {quest.total}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${difficultyColors[quest.difficulty]}`}
                />
              </div>
            </div>
          )}

          {/* Rewards */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Gift size={14} />
              <span>{quest.reward.coins}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <Zap size={14} />
              <span>{quest.reward.xp} XP</span>
            </div>
            {quest.reward.gems && (
              <div className="flex items-center gap-1 text-blue-400">
                <Crown size={14} />
                <span>{quest.reward.gems}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          {quest.completed ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium text-sm"
            >
              Claim
            </motion.button>
          ) : isCompleted ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-sm"
            >
              Complete
            </motion.button>
          ) : quest.timeLeft ? (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {quest.timeLeft}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
});

const QuestSystem = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('daily');
  const [quests, setQuests] = useState(mockQuests);
  const [claimedQuest, setClaimedQuest] = useState(null);

  const handleClaim = (quest) => {
    setClaimedQuest(quest);
    setQuests(prev => prev.map(q =>
      q.id === quest.id ? { ...q, completed: true } : q
    ));

    setTimeout(() => setClaimedQuest(null), 3000);
  };

  const filteredQuests = quests.filter(q => q.type === activeTab);
  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;

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
        className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-6 border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Target size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quests & Missions</h2>
              <p className="text-gray-400 text-sm">
                {completedCount}/{totalCount} Completed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Overview */}
        <div className="mb-6">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(questTypes).map(([key, type]) => {
            const Icon = type.icon;
            const count = quests.filter(q => q.type === key && !q.completed).length;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${activeTab === key
                    ? `bg-${type.color}-500 text-white`
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }
                `}
              >
                <Icon size={16} />
                <span>{type.name}</span>
                {count > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${activeTab === key ? 'bg-white/20' : 'bg-red-500'}
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quest List */}
        <div className="overflow-y-auto max-h-[50vh] space-y-3 pr-2">
          <AnimatePresence mode="popLayout">
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={handleClaim}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Claimed Notification */}
        <AnimatePresence>
          {claimedQuest && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <CheckCircle size={20} />
              <span>Quest completed! +{claimedQuest.reward.coins} coins</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default QuestSystem;
