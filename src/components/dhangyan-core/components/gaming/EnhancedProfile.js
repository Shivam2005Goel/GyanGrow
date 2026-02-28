import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, Edit2, Check, Award, Briefcase, GraduationCap, 
  Trophy, Star, MapPin, Link as LinkIcon, Mail, Phone,
  Github, Linkedin, Twitter, Globe, Download, Share2, 
  Shield, BadgeCheck, Zap, TrendingUp, Users, Clock,
  FileText, Plus, Trash2, Eye, EyeOff, Copy, CheckCircle2,
  Medal, Crown, Target, Flame, Gem, Coins, Wallet,
  Building2, MapPinOff, DollarSign, Calendar, ChevronRight,
  Brain, BookOpen, Lock, User, Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatedButton } from '../ui';

// Badge definitions with rarity and requirements
const BADGE_DEFINITIONS = [
  // Gaming Badges
  { id: 'first_win', name: 'First Victory', icon: Trophy, color: 'bronze', rarity: 'common', xp: 100, category: 'gaming', desc: 'Win your first game' },
  { id: 'lucky_spin', name: 'Lucky Spinner', icon: Target, color: 'gold', rarity: 'rare', xp: 500, category: 'gaming', desc: 'Hit jackpot in Lucky Spin' },
  { id: 'memory_master', name: 'Memory Master', icon: Brain, color: 'silver', rarity: 'uncommon', xp: 300, category: 'gaming', desc: 'Complete Memory Match with 30s+ left' },
  { id: 'stock_guru', name: 'Stock Guru', icon: TrendingUp, color: 'gold', rarity: 'epic', xp: 1000, category: 'gaming', desc: 'Make 5000+ profit in Stock Market' },
  { id: 'budget_expert', name: 'Budget Expert', icon: Wallet, color: 'platinum', rarity: 'legendary', xp: 1500, category: 'gaming', desc: 'Complete all Budget Master levels' },
  { id: 'trivia_king', name: 'Trivia King', icon: Crown, color: 'gold', rarity: 'epic', xp: 800, category: 'gaming', desc: 'Score 200+ in Financial Trivia' },
  { id: 'millionaire', name: 'Virtual Millionaire', icon: Coins, color: 'diamond', rarity: 'legendary', xp: 2000, category: 'gaming', desc: 'Earn 100,000+ total coins' },
  { id: 'streak_master', name: 'Streak Master', icon: Flame, color: 'gold', rarity: 'epic', xp: 1000, category: 'gaming', desc: '30-day gaming streak' },
  
  // Learning Badges
  { id: 'learner', name: 'Dedicated Learner', icon: GraduationCap, color: 'bronze', rarity: 'common', xp: 200, category: 'learning', desc: 'Complete 5 courses' },
  { id: 'scholar', name: 'Financial Scholar', icon: BookOpen, color: 'silver', rarity: 'uncommon', xp: 500, category: 'learning', desc: 'Complete 20 courses' },
  { id: 'expert', name: 'Finance Expert', icon: Award, color: 'gold', rarity: 'rare', xp: 1000, category: 'learning', desc: 'Complete 50 courses' },
  { id: 'quiz_champion', name: 'Quiz Champion', icon: Target, color: 'platinum', rarity: 'epic', xp: 1500, category: 'learning', desc: 'Get perfect score in 10 quizzes' },
  
  // Achievement Badges
  { id: 'social_butterfly', name: 'Social Butterfly', icon: Users, color: 'silver', rarity: 'uncommon', xp: 300, category: 'social', desc: 'Connect with 50+ users' },
  { id: 'influencer', name: 'Finance Influencer', icon: Share2, color: 'gold', rarity: 'rare', xp: 800, category: 'social', desc: 'Share 100+ achievements' },
  { id: 'mentor', name: 'Financial Mentor', icon: Users, color: 'platinum', rarity: 'epic', xp: 1500, category: 'social', desc: 'Help 20+ users with financial advice' },
];

// Job listings based on badges/skills
const JOB_LISTINGS = [
  {
    id: 1,
    title: 'Junior Financial Analyst',
    company: 'HDFC Bank',
    location: 'Mumbai, India',
    type: 'Full-time',
    salary: '₹6-8 LPA',
    requiredBadges: ['learner', 'scholar'],
    description: 'Looking for finance enthusiasts with strong fundamentals.',
    skills: ['Budgeting', 'Financial Analysis', 'Excel'],
    postedDate: '2 days ago',
    logo: '🏦',
    remote: false
  },
  {
    id: 2,
    title: 'Investment Associate',
    company: 'Zerodha',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹12-15 LPA',
    requiredBadges: ['stock_guru', 'expert'],
    description: 'Join India\'s leading stockbroker as an Investment Associate.',
    skills: ['Stock Market', 'Portfolio Management', 'Research'],
    postedDate: '1 week ago',
    logo: '📈',
    remote: true
  },
  {
    id: 3,
    title: 'Financial Content Creator',
    company: 'Groww',
    location: 'Remote',
    type: 'Contract',
    salary: '₹50,000/month',
    requiredBadges: ['influencer', 'trivia_king'],
    description: 'Create engaging financial content for our platform.',
    skills: ['Content Writing', 'Social Media', 'Finance'],
    postedDate: '3 days ago',
    logo: '📝',
    remote: true
  },
  {
    id: 4,
    title: 'Personal Finance Coach',
    company: 'Independence',
    location: 'Remote',
    type: 'Freelance',
    salary: '₹2000/hour',
    requiredBadges: ['mentor', 'budget_expert'],
    description: 'Help individuals achieve financial freedom through coaching.',
    skills: ['Coaching', 'Budgeting', 'Communication'],
    postedDate: '5 days ago',
    logo: '🎯',
    remote: true
  },
  {
    id: 5,
    title: 'Crypto Analyst',
    company: 'CoinDCX',
    location: 'Delhi, India',
    type: 'Full-time',
    salary: '₹10-14 LPA',
    requiredBadges: ['expert', 'quiz_champion'],
    description: 'Analyze cryptocurrency markets and provide insights.',
    skills: ['Crypto', 'Technical Analysis', 'Research'],
    postedDate: '1 day ago',
    logo: '₿',
    remote: false
  },
];

// Avatar options
const AVATAR_OPTIONS = [
  { id: 'wizard', emoji: '🧙‍♂️', name: 'Financial Wizard', unlockLevel: 1 },
  { id: 'warrior', emoji: '⚔️', name: 'Wealth Warrior', unlockLevel: 5 },
  { id: 'king', emoji: '👑', name: 'Money Monarch', unlockLevel: 10 },
  { id: 'ninja', emoji: '🥷', name: 'Budget Ninja', unlockLevel: 15 },
  { id: 'robot', emoji: '🤖', name: 'AI Trader', unlockLevel: 20 },
  { id: 'dragon', emoji: '🐉', name: 'Wealth Dragon', unlockLevel: 25 },
];

// Frame options
const FRAME_OPTIONS = [
  { id: 'none', name: 'None', style: 'border-transparent', unlockLevel: 1 },
  { id: 'bronze', name: 'Bronze', style: 'border-amber-700', unlockLevel: 5 },
  { id: 'silver', name: 'Silver', style: 'border-gray-400', unlockLevel: 10 },
  { id: 'gold', name: 'Gold', style: 'border-yellow-400', unlockLevel: 15 },
  { id: 'diamond', name: 'Diamond', style: 'border-cyan-400', unlockLevel: 20 },
  { id: 'legendary', name: 'Legendary', style: 'border-purple-500', unlockLevel: 25 },
];

const EnhancedProfile = ({ user, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showDigitalId, setShowDigitalId] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // User state
  const [profile, setProfile] = useState({
    name: user?.name || 'Player',
    username: user?.username || 'player123',
    bio: user?.bio || 'Finance enthusiast | Gamer | Learner',
    location: user?.location || 'India',
    email: user?.email || 'player@example.com',
    phone: user?.phone || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    avatar: user?.avatar || 'wizard',
    frame: user?.frame || 'none',
    title: user?.title || 'Financial Novice',
    badges: user?.badges || ['first_win', 'learner'],
    stats: user?.stats || {
      gamesPlayed: 45,
      coursesCompleted: 12,
      totalEarnings: 15200,
      currentStreak: 7,
      longestStreak: 15,
      joinDate: '2024-01-15'
    }
  });

  const [editForm, setEditForm] = useState({ ...profile });

  // Calculate level from XP
  const calculateLevel = (xp) => Math.floor(xp / 1000) + 1;
  const level = calculateLevel(user?.xp || 7500);
  const xpProgress = ((user?.xp || 7500) % 1000) / 1000 * 100;

  // Get earned badges
  const earnedBadges = BADGE_DEFINITIONS.filter(badge => profile.badges.includes(badge.id));
  const unlockedJobs = JOB_LISTINGS.filter(job => 
    job.requiredBadges.every(badge => profile.badges.includes(badge))
  );

  // Handle save
  const handleSave = () => {
    setProfile(editForm);
    onUpdate?.(editForm);
    setIsEditing(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  // Generate digital ID
  const generateDigitalId = () => {
    const id = `DHAN-${profile.username.toUpperCase()}-${Date.now().toString(36).slice(-6)}`;
    return id;
  };

  const digitalId = generateDigitalId();

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Games Played', value: profile.stats.gamesPlayed, icon: Trophy, color: 'text-yellow-400' },
          { label: 'Courses Done', value: profile.stats.coursesCompleted, icon: GraduationCap, color: 'text-blue-400' },
          { label: 'Total Earnings', value: `₹${profile.stats.totalEarnings}`, icon: Wallet, color: 'text-green-400' },
          { label: 'Current Streak', value: `${profile.stats.currentStreak} days`, icon: Flame, color: 'text-orange-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Digital Identity Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">Verified Digital Identity</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
            <p className="text-gray-400 text-sm mb-3">@{profile.username}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-green-400" />
                Level {level}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-yellow-400" />
                {earnedBadges.length} Badges
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`w-20 h-20 rounded-full border-4 ${FRAME_OPTIONS.find(f => f.id === profile.frame)?.style || 'border-transparent'} bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl`}>
              {AVATAR_OPTIONS.find(a => a.id === profile.avatar)?.emoji || '🧙‍♂️'}
            </div>
          </div>
        </div>

        <div className="relative mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Digital ID</p>
            <p className="font-mono text-sm">{digitalId}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => copyToClipboard(digitalId)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowDigitalId(true)}
              className="px-4 py-2 bg-purple-500 rounded-lg text-sm font-bold hover:bg-purple-600 transition-colors"
            >
              View Card
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Badges */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Recently Earned Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {earnedBadges.slice(0, 4).map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-sm">{badge.name}</h4>
              <p className="text-xs text-gray-400 capitalize">{badge.rarity}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Badges Tab
  const renderBadges = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">All Badges ({earnedBadges.length}/{BADGE_DEFINITIONS.length})</h3>
        <div className="flex gap-2">
          {['all', 'gaming', 'learning', 'social'].map(cat => (
            <button key={cat} className="px-3 py-1.5 bg-white/10 rounded-full text-xs capitalize hover:bg-white/20">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BADGE_DEFINITIONS.map((badge, i) => {
          const isEarned = profile.badges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                isEarned 
                  ? 'bg-white/10 border-yellow-500/30' 
                  : 'bg-white/5 border-white/5 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center flex-shrink-0`}>
                  <badge.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">{badge.name}</h4>
                    {isEarned && <BadgeCheck className="w-4 h-4 text-green-400" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{badge.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${getRarityBg(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                    <span className="text-[10px] text-purple-400">+{badge.xp} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Render Jobs Tab
  const renderJobs = () => (
    <div className="space-y-6">
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-green-400" />
          <div>
            <h3 className="font-bold">Job Opportunities</h3>
            <p className="text-sm text-gray-400">
              {unlockedJobs.length} jobs matched your skills • {JOB_LISTINGS.length - unlockedJobs.length} require more badges
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {JOB_LISTINGS.map((job, i) => {
          const canApply = job.requiredBadges.every(b => profile.badges.includes(b));
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-xl border transition-all ${
                canApply 
                  ? 'bg-white/10 border-green-500/30' 
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-3xl">
                    {job.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{job.title}</h4>
                    <p className="text-gray-400">{job.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {job.salary}
                      </span>
                      {job.remote && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Remote</span>
                      )}
                    </div>
                    
                    {/* Required Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.requiredBadges.map(badgeId => {
                        const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                        const hasBadge = profile.badges.includes(badgeId);
                        return (
                          <span 
                            key={badgeId}
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                              hasBadge ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {hasBadge ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {badge?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (canApply) {
                      setSelectedJob(job);
                      setShowApplyModal(true);
                    }
                  }}
                  disabled={!canApply}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${
                    canApply 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canApply ? 'Apply Now' : 'Locked'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Render Customize Tab
  const renderCustomize = () => (
    <div className="space-y-6">
      {/* Avatar Selection */}
      <div>
        <h3 className="text-lg font-bold mb-4">Choose Avatar</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {AVATAR_OPTIONS.map((avatar) => {
            const isUnlocked = level >= avatar.unlockLevel;
            const isSelected = editForm.avatar === avatar.id;
            return (
              <button
                key={avatar.id}
                onClick={() => isUnlocked && setEditForm({ ...editForm, avatar: avatar.id })}
                disabled={!isUnlocked}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-500/20' 
                    : isUnlocked 
                      ? 'border-white/10 hover:border-white/30' 
                      : 'border-white/5 opacity-40'
                }`}
              >
                <div className="text-4xl mb-2">{isUnlocked ? avatar.emoji : '🔒'}</div>
                <p className="text-xs font-medium">{avatar.name}</p>
                {!isUnlocked && (
                  <p className="text-[10px] text-gray-500">Level {avatar.unlockLevel}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Selection */}
      <div>
        <h3 className="text-lg font-bold mb-4">Choose Frame</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {FRAME_OPTIONS.map((frame) => {
            const isUnlocked = level >= frame.unlockLevel;
            const isSelected = editForm.frame === frame.id;
            return (
              <button
                key={frame.id}
                onClick={() => isUnlocked && setEditForm({ ...editForm, frame: frame.id })}
                disabled={!isUnlocked}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? `${frame.style} bg-white/10` 
                    : isUnlocked 
                      ? 'border-white/10 hover:border-white/30' 
                      : 'border-white/5 opacity-40'
                }`}
              >
                <div className={`w-12 h-12 rounded-full border-4 mx-auto mb-2 ${frame.style}`} />
                <p className="text-xs font-medium">{frame.name}</p>
                {!isUnlocked && (
                  <p className="text-[10px] text-gray-500">Level {frame.unlockLevel}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title Selection */}
      <div>
        <h3 className="text-lg font-bold mb-4">Choose Title</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Financial Novice',
            'Budget Beginner',
            'Investment Enthusiast',
            'Money Master',
            'Wealth Builder',
            'Finance Guru',
            'Investment Legend',
            'Financial Titan'
          ].map((title, i) => {
            const isUnlocked = level >= (i + 1) * 3;
            const isSelected = editForm.title === title;
            return (
              <button
                key={title}
                onClick={() => isUnlocked && setEditForm({ ...editForm, title })}
                disabled={!isUnlocked}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-500/20' 
                    : isUnlocked 
                      ? 'border-white/10 hover:border-white/30' 
                      : 'border-white/5 opacity-40'
                }`}
              >
                {isUnlocked ? title : '🔒 Locked'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Helper functions
  function getRarityColor(rarity) {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'uncommon': return 'from-green-500 to-green-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  }

  function getRarityBg(rarity) {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400';
      case 'uncommon': return 'bg-green-500/20 text-green-400';
      case 'rare': return 'bg-blue-500/20 text-blue-400';
      case 'epic': return 'bg-purple-500/20 text-purple-400';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <h1 className="text-xl font-bold">Profile & Digital Identity</h1>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button 
              onClick={() => { setEditForm(profile); setIsEditing(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-xl hover:bg-green-600"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </>
          )}
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 hidden md:block p-4">
          {/* Profile Card */}
          <div className="text-center mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full border-4 ${FRAME_OPTIONS.find(f => f.id === (isEditing ? editForm.frame : profile.frame))?.style || 'border-transparent'} bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl mb-3`}>
              {AVATAR_OPTIONS.find(a => a.id === (isEditing ? editForm.avatar : profile.avatar))?.emoji || '🧙‍♂️'}
            </div>
            <h2 className="font-bold text-lg">{isEditing ? editForm.name : profile.name}</h2>
            <p className="text-sm text-purple-400">{isEditing ? editForm.title : profile.title}</p>
            
            {/* Level Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Level {level}</span>
                <span>{user?.xp || 7500} XP</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: User, label: 'Overview' },
              { id: 'badges', icon: Award, label: 'Badges' },
              { id: 'jobs', icon: Briefcase, label: 'Job Board' },
              { id: 'customize', icon: Palette, label: 'Customize' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isEditing ? renderCustomize() : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'badges' && renderBadges()}
              {activeTab === 'jobs' && renderJobs()}
              {activeTab === 'customize' && renderCustomize()}
            </>
          )}
        </main>
      </div>

      {/* Digital ID Modal */}
      <AnimatePresence>
        {showDigitalId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDigitalId(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              {/* Digital ID Card */}
              <div className="relative aspect-[1.586/1] bg-gradient-to-br from-purple-600 via-purple-800 to-black rounded-2xl overflow-hidden shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>

                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

                {/* Card Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Shield className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-xs text-purple-300 font-bold tracking-wider">DHAN GYAN</p>
                        <p className="text-[10px] text-gray-400">VERIFIED DIGITAL IDENTITY</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">ISSUED</p>
                      <p className="text-xs">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex items-center gap-4 my-4">
                    <div className={`w-24 h-24 rounded-full border-4 ${FRAME_OPTIONS.find(f => f.id === profile.frame)?.style || 'border-transparent'} bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl shadow-lg`}>
                      {AVATAR_OPTIONS.find(a => a.id === profile.avatar)?.emoji || '🧙‍♂️'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{profile.name}</h3>
                      <p className="text-purple-300">{profile.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          Level {level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-400" />
                          {earnedBadges.length} Badges
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ID Number */}
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 mb-1">DIGITAL ID NUMBER</p>
                    <p className="font-mono text-sm tracking-wider">{digitalId}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      {profile.badges.slice(0, 3).map((badgeId, i) => {
                        const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                        return badge ? (
                          <div key={i} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <badge.icon className="w-4 h-4" />
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">VERIFIED BY</p>
                      <p className="text-xs font-bold">DHAN GYAN NETWORK</p>
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => copyToClipboard(digitalId)}
                  className="flex-1 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy ID'}
                </button>
                <button 
                  onClick={() => {
                    confetti({ particleCount: 100 });
                  }}
                  className="flex-1 py-3 bg-purple-500 rounded-xl font-bold hover:bg-purple-600 transition-colors"
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share
                </button>
              </div>

              <button 
                onClick={() => setShowDigitalId(false)}
                className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Application Modal */}
      <AnimatePresence>
        {showApplyModal && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 rounded-2xl max-w-lg w-full p-6 border border-white/20"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Apply for {selectedJob.title}</h3>
                <p className="text-gray-400">at {selectedJob.company}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Your Digital ID</p>
                  <p className="font-mono text-sm">{digitalId}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Qualifications</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedJob.requiredBadges.map(badgeId => {
                      const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                      return (
                        <span key={badgeId} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                          ✓ {badge?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 border border-white/20 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    confetti({ particleCount: 150 });
                    setShowApplyModal(false);
                    alert('Application submitted successfully! The recruiter will review your digital identity and badges.');
                  }}
                  className="flex-1 py-3 bg-green-500 rounded-xl font-bold hover:bg-green-600"
                >
                  Submit Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedProfile;
