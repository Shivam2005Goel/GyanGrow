import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Medal, Crown, Star, TrendingUp, Users,
  Target, Flame, Zap, ChevronUp, ChevronDown, X,
  Shield, Award, Sparkles
} from 'lucide-react';
import { AnimatedButton } from '../ui';

const tiers = [
  { name: 'Bronze', color: 'from-orange-700 to-orange-500', icon: Medal, minPoints: 0, glow: 'shadow-orange-500/50' },
  { name: 'Silver', color: 'from-slate-400 to-slate-200', icon: Medal, minPoints: 1000, glow: 'shadow-slate-400/50' },
  { name: 'Gold', color: 'from-yellow-500 to-amber-300', icon: Trophy, minPoints: 5000, glow: 'shadow-yellow-500/50' },
  { name: 'Platinum', color: 'from-cyan-400 to-blue-500', icon: Trophy, minPoints: 15000, glow: 'shadow-cyan-400/50' },
  { name: 'Diamond', color: 'from-fuchsia-500 to-pink-500', icon: Crown, minPoints: 50000, glow: 'shadow-fuchsia-500/50' },
  { name: 'Legend', color: 'from-red-600 via-orange-500 to-yellow-500', icon: Crown, minPoints: 100000, glow: 'shadow-red-500/50' },
];

const mockLeaderboard = [
  {
    rank: 1,
    name: 'Priya Sharma',
    avatar: '👩‍💼',
    level: 45,
    xp: 125000,
    streak: 89,
    courses: 47,
    character: 'sage',
    tier: 'Legend',
    country: '🇮🇳',
  },
  {
    rank: 2,
    name: 'Rahul Verma',
    avatar: '👨‍💼',
    level: 42,
    xp: 118000,
    streak: 76,
    courses: 45,
    character: 'wizard',
    tier: 'Legend',
    country: '🇮🇳',
  },
  {
    rank: 3,
    name: 'Ananya Patel',
    avatar: '👩‍🎓',
    level: 40,
    xp: 105000,
    streak: 92,
    courses: 43,
    character: 'healer',
    tier: 'Diamond',
    country: '🇮🇳',
  },
  {
    rank: 4,
    name: 'Arjun Kumar',
    avatar: '👨‍🎓',
    level: 38,
    xp: 98000,
    streak: 45,
    courses: 40,
    character: 'warrior',
    tier: 'Diamond',
    country: '🇮🇳',
  },
  {
    rank: 5,
    name: 'Neha Gupta',
    avatar: '👩‍💻',
    level: 36,
    xp: 92000,
    streak: 67,
    courses: 38,
    character: 'ranger',
    tier: 'Platinum',
    country: '🇮🇳',
  },
  {
    rank: 6,
    name: 'Vikram Singh',
    avatar: '👨‍💻',
    level: 35,
    xp: 88000,
    streak: 34,
    courses: 36,
    character: 'wizard',
    tier: 'Platinum',
    country: '🇮🇳',
  },
  {
    rank: 7,
    name: 'Divya Reddy',
    avatar: '👩‍🏫',
    level: 33,
    xp: 82000,
    streak: 55,
    courses: 35,
    character: 'sage',
    tier: 'Gold',
    country: '🇮🇳',
  },
  {
    rank: 8,
    name: 'Karan Malhotra',
    avatar: '👨‍🏫',
    level: 32,
    xp: 78000,
    streak: 41,
    courses: 33,
    character: 'warrior',
    tier: 'Gold',
    country: '🇮🇳',
  },
  {
    rank: 9,
    name: 'Meera Iyer',
    avatar: '👩‍🔬',
    level: 30,
    xp: 72000,
    streak: 28,
    courses: 31,
    character: 'healer',
    tier: 'Gold',
    country: '🇮🇳',
  },
  {
    rank: 10,
    name: 'Rohan Desai',
    avatar: '👨‍🔬',
    level: 29,
    xp: 68000,
    streak: 22,
    courses: 29,
    character: 'ranger',
    tier: 'Silver',
    country: '🇮🇳',
  },
];

const getTierInfo = (tierName) => tiers.find(t => t.name === tierName) || tiers[0];

const LeaderboardRow = ({ player, index, isCurrentUser }) => {
  const tierInfo = getTierInfo(player.tier);
  const TierIcon = tierInfo.icon;

  const rankStyles = {
    1: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/40 ring-2 ring-yellow-400',
    2: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white shadow-lg shadow-slate-400/40 ring-2 ring-slate-300',
    3: 'bg-gradient-to-br from-orange-300 via-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40 ring-2 ring-orange-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.3 }}
      className={`
        relative p-4 rounded-xl mb-3 transition-all duration-300 group
        ${isCurrentUser
          ? 'bg-purple-600/20 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
          : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:translate-x-1'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div className={`
          relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-transform duration-300 group-hover:scale-110
          ${rankStyles[player.rank] || 'bg-white/5 text-gray-400 border border-white/10'}
        `}>
          {player.rank <= 3 ? (
            <>
              <TierIcon size={24} className="drop-shadow-md" />
              <div className="absolute inset-0 bg-white/20 rounded-xl" />
            </>
          ) : (
            <span className="font-mono">#{player.rank}</span>
          )}
        </div>

        {/* Avatar with Status */}
        <div className="relative">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 
            ${isCurrentUser ? 'border-purple-500' : 'border-transparent group-hover:border-white/20'}
            bg-gradient-to-br from-gray-800 to-gray-900 transition-colors
          `}>
            {player.avatar}
          </div>
          {player.streak >= 30 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 p-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/30"
            >
              <Flame size={10} className="text-white fill-current" />
            </motion.div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold truncate text-lg ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
              {player.name}
            </h3>
            {player.rank <= 3 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 text-[10px] uppercase tracking-wider rounded-full font-bold"
              >
                Top {player.rank}
              </motion.span>
            )}
            <span className="text-lg opacity-80" title="India">{player.country}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
              Lvl {player.level}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="flex items-center gap-1 text-orange-400">
              <Flame size={10} className="fill-current" />
              {player.streak} day streak
            </span>
          </div>
        </div>

        {/* XP & Tier */}
        <div className="text-right">
          <div className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {player.xp.toLocaleString()} <span className="text-xs text-gray-500 font-normal">XP</span>
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${tierInfo.color} bg-clip-text text-transparent`}>
            {player.tier}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TierDisplay = ({ tier, isCurrent }) => {
  const tierInfo = tiers.find(t => t.name === tier) || tiers[0];
  const TierIcon = tierInfo.icon;

  return (
    <div className={`
      relative p-3 rounded-2xl text-center transition-all duration-300 flex-1
      ${isCurrent
        ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20 -translate-y-2'
        : 'hover:bg-white/5 opacity-40 hover:opacity-70'
      }
    `}>
      <div className={`
        w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center transform transition-transform
        bg-gradient-to-br ${tierInfo.color}
        ${isCurrent ? 'scale-110 shadow-lg ' + tierInfo.glow : ''}
      `}>
        <TierIcon size={24} className="text-white drop-shadow-md" />
      </div>
      <h4 className={`font-bold text-xs ${isCurrent ? 'text-white' : 'text-gray-400'}`}>{tier}</h4>
    </div>
  );
};

const EnhancedLeaderboard = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('global');

  const currentUser = { ...mockLeaderboard[4], rank: 4 };

  const podiumPlayers = [mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]]; // Silver, Gold, Bronze order

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[85vh] flex flex-col bg-[#0f1115] rounded-[2rem] border border-white/10 shadow-2xl shadow-purple-500/20 overflow-hidden relative"
      >
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-900/20 via-blue-900/10 to-transparent pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 px-8 flex justify-between items-center border-b border-white/5 bg-white/5 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                Leaderboard
              </h2>
              <div className="flex items-center gap-2 text-sm text-purple-300/80">
                <Sparkles size={12} />
                <span>Season 5 • Ends in 3 days</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 group"
          >
            <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

          {/* Left Panel: Statistics & Tiers */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 p-6 overflow-y-auto">

            {/* User Stats Card */}
            <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4 mb-4 relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-gray-900 border-2 border-transparent flex items-center justify-center text-3xl">
                    {currentUser.avatar}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{currentUser.name}</h3>
                  <div className="text-sm text-purple-300 font-medium">{currentUser.tier} League</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 relative">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Total XP</div>
                  <div className="font-bold text-white">{currentUser.xp.toLocaleString()}</div>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <div className="text-xs text-gray-400 mb-1">Rank</div>
                  <div className="font-bold text-white">#{currentUser.rank}</div>
                </div>
              </div>
            </div>

            {/* Tiers List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 ml-1">League Tiers</h3>
              <div className="space-y-2">
                {[...tiers].reverse().map((tier) => (
                  <div
                    key={tier.name}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${tier.name === currentUser.tier
                        ? 'bg-white/10 border border-white/10'
                        : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${tier.color}`}>
                      <tier.icon size={14} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-200">{tier.name}</div>
                      <div className="text-[10px] text-gray-500">{tier.minPoints.toLocaleString()}+ XP</div>
                    </div>
                    {tier.name === currentUser.tier && (
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel: Leaderboard */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900/50 to-black/50 overflow-hidden">

            {/* Tabs & Filters */}
            <div className="p-4 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
              {['Global', 'Friends', 'State', 'Colleagues'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`
                    px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.toLowerCase()
                      ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Podium Section */}
            <div className="pt-8 pb-4 px-8 flex justify-center items-end gap-4 min-h-[220px]">
              {podiumPlayers.map((player) => {
                const isGold = player.rank === 1;
                const isSilver = player.rank === 2;
                const isBronze = player.rank === 3;

                const height = isGold ? 'h-40' : isSilver ? 'h-32' : 'h-24';
                const color = isGold ? 'from-yellow-500/20 to-yellow-600/5' : isSilver ? 'from-slate-400/20 to-slate-500/5' : 'from-orange-500/20 to-orange-600/5';
                const borderColor = isGold ? 'border-yellow-500/30' : isSilver ? 'border-slate-400/30' : 'border-orange-500/30';
                const iconColor = isGold ? 'text-yellow-400' : isSilver ? 'text-slate-300' : 'text-orange-400';
                const delay = isGold ? 0.2 : isSilver ? 0 : 0.4;

                return (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay, type: 'spring', damping: 12 }}
                    className="flex flex-col items-center group relative z-0"
                  >
                    {/* Avatar */}
                    <div className="relative mb-3">
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative z-10
                        bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${borderColor}
                        shadow-[0_0_30px_rgba(0,0,0,0.3)] transform transition-transform duration-300 group-hover:-translate-y-2
                      `}>
                        {player.avatar}
                        {isGold && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <Crown size={24} className="text-yellow-400 fill-yellow-400 shadow-glow animate-bounce" />
                          </div>
                        )}
                      </div>

                      {/* Glow Effect */}
                      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-40 bg-${isGold ? 'yellow' : isSilver ? 'slate' : 'orange'}-500`} />
                    </div>

                    {/* Podium Column */}
                    <div className={`
                      relative w-24 ${height} rounded-t-2xl border-x border-t ${borderColor}
                      bg-gradient-to-b ${color} backdrop-blur-sm
                      flex flex-col items-center justify-start pt-4 gap-1
                    `}>
                      <span className={`text-2xl font-black ${iconColor}`}>#{player.rank}</span>
                      <span className="text-xs font-bold text-white/90 truncate max-w-[80px] text-center px-1">
                        {player.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-white/50">{player.xp.toLocaleString()}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-black/20">
              <AnimatePresence>
                {mockLeaderboard.slice(3).map((player, index) => (
                  <LeaderboardRow
                    key={player.rank}
                    player={player}
                    index={index}
                    isCurrentUser={player.rank === currentUser.rank}
                  />
                ))}
              </AnimatePresence>

              {/* Load More Trigger */}
              <div className="py-4 text-center">
                <button className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center justify-center gap-1 mx-auto">
                  <span>View More</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedLeaderboard;
