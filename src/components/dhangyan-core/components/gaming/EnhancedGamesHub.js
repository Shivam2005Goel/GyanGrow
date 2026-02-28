import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Zap, Crown, Coins, Gem, Timer, Star,
  TrendingUp, Flame, ChevronRight, Lock, Unlock, Play,
  Pause, RotateCcw, Share2, Users, Award, Sparkles,
  Gamepad2, Brain, Lightbulb, TrendingDown, PiggyBank,
  Wallet, ChartLine, Dice, Card, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatedButton } from '../ui';

// Enhanced game definitions with progression
const ENHANCED_GAMES = [
  {
    id: 'lucky_spin',
    name: 'Lucky Spin',
    icon: Dice,
    category: 'luck',
    description: 'Spin the wheel to win coins, gems & jackpots!',
    color: 'from-purple-500 to-pink-500',
    difficulty: 'easy',
    minBet: 10,
    maxBet: 1000,
    unlockLevel: 1,
    rewards: { xp: 10, coins: '50-1000', gems: '0-5' },
    features: ['Daily Free Spins', 'Jackpot Multiplier', 'Streak Bonus'],
    stats: { plays: 15420, rating: 4.8 }
  },
  {
    id: 'memory_master',
    name: 'Memory Master',
    icon: Brain,
    category: 'skill',
    description: 'Match financial symbols to train your brain',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'medium',
    timeLimit: 60,
    unlockLevel: 2,
    rewards: { xp: 25, coins: '100-500', gems: '1-3' },
    features: ['Time Bonus', 'Combo Multiplier', 'Hint System'],
    stats: { plays: 8750, rating: 4.6 }
  },
  {
    id: 'number_guess',
    name: 'Number Guess',
    icon: Target,
    category: 'skill',
    description: 'Guess the secret number 1-100',
    color: 'from-green-500 to-emerald-500',
    difficulty: 'easy',
    maxAttempts: 7,
    unlockLevel: 1,
    rewards: { xp: 15, coins: '50-200', gems: '0-2' },
    features: ['Difficulty Levels', 'Hint System', 'Streak Bonus'],
    stats: { plays: 12300, rating: 4.5 }
  },
  {
    id: 'stock_simulator',
    name: 'Stock Simulator Pro',
    icon: ChartLine,
    category: 'simulation',
    description: 'Real-time trading with candlestick charts',
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'hard',
    duration: 180,
    unlockLevel: 5,
    rewards: { xp: 50, coins: '200-5000', gems: '2-10' },
    features: ['Live Charts', 'Technical Analysis', 'Portfolio Building'],
    stats: { plays: 5420, rating: 4.9 }
  },
  {
    id: 'investment_tycoon',
    name: 'Investment Tycoon',
    icon: TrendingUp,
    category: 'simulation',
    description: '30-day market simulation with multiple assets',
    color: 'from-orange-500 to-red-500',
    difficulty: 'medium',
    duration: 30,
    unlockLevel: 3,
    rewards: { xp: 40, coins: '100-2000', gems: '1-5' },
    features: ['Multi-Asset Trading', 'Market Events', 'AI Competitors'],
    stats: { plays: 6800, rating: 4.7 }
  },
  {
    id: 'budget_master',
    name: 'Budget Master',
    icon: PiggyBank,
    category: 'education',
    description: 'Master the 50/30/20 budgeting rule',
    color: 'from-teal-500 to-green-500',
    difficulty: 'easy',
    levels: 3,
    unlockLevel: 1,
    rewards: { xp: 30, coins: '150-600', gems: '1-4' },
    features: ['Real Scenarios', 'Progressive Difficulty', 'Tips & Tricks'],
    stats: { plays: 9200, rating: 4.8 }
  },
  {
    id: 'financial_trivia',
    name: 'Financial Trivia',
    icon: Lightbulb,
    category: 'education',
    description: 'Test your financial knowledge',
    color: 'from-yellow-500 to-amber-500',
    difficulty: 'medium',
    questions: 10,
    unlockLevel: 2,
    rewards: { xp: 20, coins: '100-400', gems: '0-3' },
    features: ['1000+ Questions', 'Categories', 'Multiplayer Mode'],
    stats: { plays: 15600, rating: 4.6 }
  },
  {
    id: 'crypto_trader',
    name: 'Crypto Trader',
    icon: Wallet,
    category: 'simulation',
    description: 'Trade cryptocurrency in volatile markets',
    color: 'from-pink-500 to-rose-500',
    difficulty: 'hard',
    unlockLevel: 8,
    rewards: { xp: 60, coins: '300-8000', gems: '3-15' },
    features: ['Real Market Data', 'Leverage Trading', 'NFT Rewards'],
    stats: { plays: 3200, rating: 4.9 },
    comingSoon: true
  },
];

// Daily challenges
const DAILY_CHALLENGES = [
  { id: 1, task: 'Play 5 games', reward: 100, progress: 3, total: 5 },
  { id: 2, task: 'Win 1000 coins', reward: 200, progress: 750, total: 1000 },
  { id: 3, task: 'Complete 3 quizzes', reward: 150, progress: 1, total: 3 },
];

// Leaderboard data
const LEADERBOARD = [
  { rank: 1, name: 'ProTrader', avatar: '🏆', coins: 125000, level: 45 },
  { rank: 2, name: 'FinanceGuru', avatar: '🎯', coins: 98000, level: 38 },
  { rank: 3, name: 'MoneyMaster', avatar: '💰', coins: 87000, level: 35 },
  { rank: 4, name: 'StockKing', avatar: '📈', coins: 76000, level: 32 },
  { rank: 5, name: 'BudgetBoss', avatar: '🐷', coins: 65000, level: 28 },
];

const EnhancedGamesHub = ({ user, onClose, onProfileOpen }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userStats, setUserStats] = useState({
    totalGames: 45,
    wins: 32,
    totalCoins: 15200,
    totalGems: 45,
    currentStreak: 7,
    bestStreak: 15,
    level: user?.level || 15,
    xp: user?.xp || 7500
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const categories = [
    { id: 'all', name: 'All Games', icon: Gamepad2 },
    { id: 'luck', name: 'Luck', icon: Dice },
    { id: 'skill', name: 'Skill', icon: Target },
    { id: 'simulation', name: 'Simulation', icon: ChartLine },
    { id: 'education', name: 'Education', icon: Lightbulb },
  ];

  const filteredGames = ENHANCED_GAMES.filter(game => 
    selectedCategory === 'all' || game.category === selectedCategory
  );

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Game Card Component
  const GameCard = ({ game }) => {
    const isLocked = userStats.level < game.unlockLevel;
    const Icon = game.icon;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
        className={`relative rounded-2xl overflow-hidden border transition-all ${
          isLocked 
            ? 'bg-white/5 border-white/5 opacity-60' 
            : 'bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:border-purple-500/50 cursor-pointer'
        }`}
        onClick={() => !isLocked && setActiveGame(game.id)}
      >
        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
            game.difficulty === 'easy' ? 'bg-green-500/30 text-green-400' :
            game.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-400' :
            'bg-red-500/30 text-red-400'
          }`}>
            {game.difficulty}
          </span>
        </div>

        {/* Coming Soon Badge */}
        {game.comingSoon && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="px-4 py-2 bg-purple-500 rounded-full text-sm font-bold">
              Coming Soon
            </span>
          </div>
        )}

        <div className="p-6">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold mb-1">{game.name}</h3>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{game.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {game.features.slice(0, 2).map((feature, i) => (
              <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-300">
                {feature}
              </span>
            ))}
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              +{game.rewards.xp} XP
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-yellow-400" />
              {game.rewards.coins}
            </span>
          </div>

          {/* Stats & Play */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {game.stats.plays.toLocaleString()}
              </span>
            </div>
            
            {isLocked ? (
              <div className="flex items-center gap-1 text-xs text-red-400">
                <Lock className="w-4 h-4" />
                Level {game.unlockLevel}
              </div>
            ) : (
              <button className="flex items-center gap-1 text-sm font-bold text-purple-400 hover:text-purple-300">
                Play <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
              Games Hub
            </h1>
          </div>
        </div>

        {/* User Stats Bar */}
        <div className="flex items-center gap-4">
          {/* Level */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="font-bold">Level {userStats.level}</span>
            <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                style={{ width: `${(userStats.xp % 1000) / 1000 * 100}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="font-bold">{userStats.currentStreak}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/30">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-bold">{userStats.totalCoins.toLocaleString()}</span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
            <Gem className="w-5 h-5 text-blue-400" />
            <span className="font-bold">{userStats.totalGems}</span>
          </div>

          {/* Profile Button */}
          <button 
            onClick={onProfileOpen}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl hover:scale-110 transition-transform"
          >
            {user?.avatar || '🧙‍♂️'}
          </button>
        </div>
      </header>

      <div className="relative flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 hidden lg:block p-4 overflow-y-auto">
          {/* Quick Stats */}
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 mb-6">
            <h3 className="font-bold mb-3">Today's Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Games Played</span>
                <span>3/10</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[30%]" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Coins Earned</span>
                <span>750/2000</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[37%]" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <nav className="space-y-1 mb-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.name}
              </button>
            ))}
          </nav>

          {/* Daily Challenges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">Daily Challenges</h3>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="space-y-2">
              {DAILY_CHALLENGES.map(challenge => (
                <div key={challenge.id} className="p-3 bg-white/5 rounded-xl">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{challenge.task}</span>
                    <span className="text-yellow-400">+{challenge.reward}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {challenge.progress}/{challenge.total}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Featured Game Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative p-8 flex items-center justify-between">
              <div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3 inline-block">
                  Featured Game
                </span>
                <h2 className="text-3xl font-bold mb-2">Stock Simulator Pro</h2>
                <p className="text-gray-200 mb-4 max-w-md">
                  Experience real-time trading with professional-grade charts. 
                  Perfect for aspiring traders!
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveGame('stock_simulator')}
                    className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    Play Now
                  </button>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>4.9</span>
                    <span className="text-gray-300">(5,420 plays)</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block text-8xl">
                📈
              </div>
            </div>
          </motion.div>

          {/* Games Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {selectedCategory === 'all' ? 'All Games' : 
                  categories.find(c => c.id === selectedCategory)?.name}
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({filteredGames.length})
                </span>
              </h2>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowLeaderboard(true)}
                  className="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 transition-colors"
                >
                  <Trophy className="w-4 h-4 inline mr-2" />
                  Leaderboard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Top Players
                </h3>
                <button onClick={() => setShowLeaderboard(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {LEADERBOARD.map((player, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      i === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                      i === 1 ? 'bg-gray-400/20 border border-gray-400/30' :
                      i === 2 ? 'bg-orange-600/20 border border-orange-600/30' :
                      'bg-white/5'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      i === 0 ? 'bg-yellow-500 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-orange-600 text-white' :
                      'bg-white/10'
                    }`}>
                      {player.rank}
                    </span>
                    <span className="text-2xl">{player.avatar}</span>
                    <div className="flex-1">
                      <p className="font-bold">{player.name}</p>
                      <p className="text-xs text-gray-400">Level {player.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">
                        {player.coins.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">coins</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="px-4 py-3 bg-green-500 rounded-xl shadow-lg flex items-center gap-3"
            >
              <Award className="w-5 h-5" />
              {notif.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedGamesHub;
