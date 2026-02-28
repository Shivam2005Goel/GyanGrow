import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Target, Zap, Star, TrendingUp, Clock,
  Award, BookOpen, CheckCircle, Lock, Unlock, Flame, Brain, Wallet,
  TrendingDown, PiggyBank, Shield, BarChart3, Globe, Cpu,
  Building2, Landmark, Coins, CreditCard, Calculator, FileText,
  ChevronRight, Play, Pause, RotateCcw, Filter, Search, X,
  TrendingUp as TrendIcon, Calendar, Activity, ChevronDown,
  GraduationCap, PlayCircle, CheckCircle2, Lock as LockIcon,
  Sparkles, ArrowRight, MoreHorizontal, Hash, Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton, GlassCard, Badge, SectionTitle, ProgressBar } from '../components/ui';
import { SkillsProvider, useSkills } from '../contexts/SkillsContext';

// Icon mapping
const iconMap = {
  BarChart3, TrendingDown, FileText, Target, Wallet,
  Calculator, Shield, Clock, Coins, Globe, CreditCard,
  Building2, Landmark, Cpu, PiggyBank
};

// Skill Card Component
const SkillCard = ({ skill, onClick }) => {
  const Icon = iconMap[skill.icon] || BookOpen;
  const progress = (skill.xp / skill.maxXp) * 100;
  const moduleProgress = (skill.completedModules / skill.totalModules) * 100;
  
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(skill)}
      className={`relative overflow-hidden rounded-2xl border ${
        skill.locked 
          ? 'bg-gray-900/50 border-gray-700/50 opacity-75' 
          : 'bg-white/5 border-white/10 hover:border-purple-500/50'
      } transition-all cursor-pointer group`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${skill.categoryColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.categoryColor} flex items-center justify-center ${skill.locked ? 'grayscale' : ''}`}>
            {skill.locked ? <Lock size={20} className="text-white" /> : <Icon size={22} className="text-white" />}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(skill.maxLevel)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < skill.level 
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-400' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <h3 className="font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">
          {skill.name}
        </h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{skill.description}</p>

        {/* Module Progress */}
        {!skill.locked && (
          <div className="mb-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-400">{skill.completedModules}/{skill.totalModules} Modules</span>
              <span className="text-purple-400 font-medium">{Math.round(moduleProgress)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${moduleProgress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* XP Progress */}
        {!skill.locked && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-400">Level {skill.level}</span>
              <span className="text-purple-400 font-medium">{skill.xp}/{skill.maxXp} XP</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {skill.totalModules} modules
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {skill.estimatedTime}
            </span>
          </div>
          {skill.badges.length > 0 && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Award size={12} />
              {skill.badges.length}
            </span>
          )}
        </div>

        {/* Prerequisites Warning */}
        {skill.locked && skill.prerequisites.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <LockIcon size={12} />
              Requires: {skill.prerequisites.join(', ')}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Module Item Component
const ModuleItem = ({ module, index, onComplete, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        module.completed 
          ? 'bg-green-500/10 border border-green-500/30' 
          : isActive 
            ? 'bg-purple-500/10 border border-purple-500/30' 
            : 'bg-white/5 border border-white/10'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        module.completed 
          ? 'bg-green-500/30 text-green-400' 
          : isActive 
            ? 'bg-purple-500/30 text-purple-400' 
            : 'bg-white/10 text-gray-500'
      }`}>
        {module.completed ? (
          <CheckCircle2 size={20} />
        ) : isActive ? (
          <PlayCircle size={20} />
        ) : (
          <LockIcon size={18} />
        )}
      </div>
      
      <div className="flex-1">
        <h4 className={`font-medium ${module.completed ? 'text-green-400' : isActive ? 'text-purple-300' : 'text-gray-400'}`}>
          {module.name}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <Timer size={12} />
          {module.duration}
          {module.completed && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-green-400">Completed</span>
            </>
          )}
        </div>
      </div>
      
      {isActive && !module.completed && (
        <AnimatedButton 
          variant="primary" 
          size="sm"
          onClick={() => onComplete(module.id)}
        >
          Start
        </AnimatedButton>
      )}
    </motion.div>
  );
};

// Skill Detail Modal
const SkillDetailModal = ({ skill, onClose }) => {
  const { completeModule } = useSkills();
  const [activeTab, setActiveTab] = useState('modules');
  
  if (!skill) return null;
  const Icon = iconMap[skill.icon] || BookOpen;
  const progress = (skill.xp / skill.maxXp) * 100;

  const handleCompleteModule = (moduleId) => {
    completeModule(skill.categoryKey, skill.id, moduleId);
  };

  const nextModule = skill.modules.find(m => !m.completed);
  const completedCount = skill.modules.filter(m => m.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-950 rounded-3xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className={`h-32 bg-gradient-to-br ${skill.categoryColor} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-10 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="relative h-full flex items-end p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{skill.name}</h2>
                <p className="text-white/80">{skill.categoryName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-128px)]">
          {/* Progress Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <GlassCard className="text-center p-4">
              <Trophy size={20} className="mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold">{skill.level}</div>
              <div className="text-xs text-gray-400">Level</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <Zap size={20} className="mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">{skill.xp}</div>
              <div className="text-xs text-gray-400">XP</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <CheckCircle size={20} className="mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">{completedCount}/{skill.totalModules}</div>
              <div className="text-xs text-gray-400">Modules</div>
            </GlassCard>
          </div>

          {/* Continue Learning CTA */}
          {nextModule && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Continue where you left off</p>
                  <h4 className="font-bold text-lg">{nextModule.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Timer size={12} />
                    {nextModule.duration}
                  </div>
                </div>
                <AnimatedButton 
                  variant="primary"
                  onClick={() => handleCompleteModule(nextModule.id)}
                >
                  <Play size={16} className="mr-1" />
                  Continue
                </AnimatedButton>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {['modules', 'resources', 'badges'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'modules' && (
              <motion.div
                key="modules"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {skill.modules.map((module, idx) => (
                  <ModuleItem
                    key={module.id}
                    module={module}
                    index={idx}
                    isActive={!module.completed && (idx === 0 || skill.modules[idx - 1].completed)}
                    onComplete={handleCompleteModule}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {skill.resources && skill.resources.length > 0 ? (
                  skill.resources.map((resource, idx) => (
                    <GlassCard key={idx} className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        {resource.type === 'video' ? <PlayCircle size={20} className="text-purple-400" /> :
                         resource.type === 'calculator' ? <Calculator size={20} className="text-green-400" /> :
                         resource.type === 'quiz' ? <Brain size={20} className="text-yellow-400" /> :
                         <FileText size={20} className="text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-xs text-gray-400">
                          {resource.duration || resource.readTime || resource.description}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-gray-500" />
                    </GlassCard>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No additional resources available</p>
                )}
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div
                key="badges"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap gap-2"
              >
                {skill.badges.map((badge, idx) => (
                  <Badge key={idx} color="yellow" className="flex items-center gap-2 px-3 py-2">
                    <Award size={16} />
                    {badge}
                  </Badge>
                ))}
                {skill.badges.length === 0 && (
                  <p className="text-center text-gray-500 py-8 w-full">Complete modules to earn badges!</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Weekly Progress Component
const WeeklyProgress = ({ stats }) => {
  const progress = (stats.weeklyProgress / stats.weeklyGoal) * 100;
  
  return (
    <GlassCard className="p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold flex items-center gap-2">
          <Calendar size={18} className="text-purple-400" />
          Weekly Goal
        </h3>
        <span className="text-sm text-gray-400">{stats.weeklyProgress}/{stats.weeklyGoal} hours</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {progress >= 100 ? '🎉 Goal achieved! Keep up the momentum!' : 
         `${Math.round(stats.weeklyGoal - stats.weeklyProgress)} hours remaining this week`}
      </p>
    </GlassCard>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  return (
    <GlassCard className="p-4">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <Activity size={18} className="text-blue-400" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3 text-sm"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              activity.type === 'module_complete' ? 'bg-green-500/20 text-green-400' :
              activity.type === 'xp_earned' ? 'bg-purple-500/20 text-purple-400' :
              activity.type === 'badge_earned' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-orange-500/20 text-orange-400'
            }`}>
              {activity.type === 'module_complete' ? <CheckCircle size={14} /> :
               activity.type === 'xp_earned' ? <Zap size={14} /> :
               activity.type === 'badge_earned' ? <Award size={14} /> :
               <Flame size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {activity.type === 'module_complete' ? `Completed ${activity.module}` :
                 activity.type === 'xp_earned' ? `Earned ${activity.amount} XP` :
                 activity.type === 'badge_earned' ? `Earned ${activity.badge} badge` :
                 `${activity.days} day streak!`}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

// Main Skills Page Content
const SkillsPageContent = () => {
  const navigate = useNavigate();
  const { categories, userStats, achievements, recentActivity, getAllSkills } = useSkills();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocked, setFilterLocked] = useState('all');

  const allSkills = getAllSkills();
  
  const filteredSkills = useMemo(() => {
    return allSkills.filter(skill => {
      const matchesCategory = selectedCategory === 'all' || skill.categoryKey === selectedCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocked = filterLocked === 'all' || 
                           (filterLocked === 'locked' && skill.locked) ||
                           (filterLocked === 'unlocked' && !skill.locked);
      return matchesCategory && matchesSearch && matchesLocked;
    });
  }, [allSkills, selectedCategory, searchQuery, filterLocked]);

  const categoryList = Object.entries(categories);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </motion.button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Brain className="text-purple-400" size={24} />
              Skills Mastery
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm focus:outline-none focus:border-purple-500 transition-colors w-64"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-purple-400">{userStats.totalXp.toLocaleString()} XP</div>
                <div className="text-xs text-gray-400">Level {userStats.level}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Trophy size={18} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-80 bg-gray-900/50 border-r border-white/10 p-4 space-y-4">
          {/* Weekly Progress */}
          <WeeklyProgress stats={userStats} />
          
          {/* Category Filter */}
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <Hash size={16} />
                All Skills
              </button>
              {categoryList.map(([key, cat]) => {
                const Icon = iconMap[cat.icon] || Brain;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                      selectedCategory === key
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    <Icon size={16} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity activities={recentActivity} />
        </div>

        {/* Skills Grid */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <GlassCard className="text-center">
              <Target size={24} className="mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{allSkills.length}</div>
              <div className="text-xs text-gray-400">Total Skills</div>
            </GlassCard>
            <GlassCard className="text-center">
              <Unlock size={24} className="mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">{allSkills.filter(s => !s.locked).length}</div>
              <div className="text-xs text-gray-400">Unlocked</div>
            </GlassCard>
            <GlassCard className="text-center">
              <CheckCircle size={24} className="mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">{allSkills.filter(s => s.level === s.maxLevel).length}</div>
              <div className="text-xs text-gray-400">Mastered</div>
            </GlassCard>
            <GlassCard className="text-center">
              <Flame size={24} className="mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold">{userStats.streakDays}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </GlassCard>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <select
              value={filterLocked}
              onChange={(e) => setFilterLocked(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Skills</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
            </select>
            <Badge color="purple">{filteredSkills.length} skills</Badge>
          </div>

          {/* Skills Grid */}
          <motion.div 
            layout
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onClick={setSelectedSkill}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <Brain size={48} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-400">No skills found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailModal
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Wrapper with Provider
const SkillsPage = () => (
  <SkillsProvider>
    <SkillsPageContent />
  </SkillsProvider>
);

export default SkillsPage;
