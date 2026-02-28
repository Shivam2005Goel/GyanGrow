import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet, 
  Target, 
  Award,
  BookOpen,
  Zap,
  Calendar,
  Flame,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { GlassCard, AnimatedButton, ProgressBar, StatCard } from '../ui';
// import { useScrollAnimation } from '../../hooks/useAnimations';

const mockData = {
  user: {
    name: 'Alex',
    level: 15,
    xp: 7500,
    nextLevelXp: 10000,
    streak: 7,
    totalSavings: 45000,
    coursesCompleted: 12,
    badges: 8,
  },
  weeklyProgress: [
    { day: 'Mon', xp: 450 },
    { day: 'Tue', xp: 320 },
    { day: 'Wed', xp: 580 },
    { day: 'Thu', xp: 420 },
    { day: 'Fri', xp: 650 },
    { day: 'Sat', xp: 380 },
    { day: 'Sun', xp: 520 },
  ],
  skills: [
    { name: 'Budgeting', level: 75 },
    { name: 'Investing', level: 45 },
    { name: 'Saving', level: 60 },
    { name: 'Tax Planning', level: 30 },
  ],
  recentActivities: [
    { type: 'course', title: 'Investment Basics', time: '2 hours ago', xp: 100 },
    { type: 'quiz', title: 'Budgeting Quiz', time: '5 hours ago', xp: 50 },
    { type: 'challenge', title: 'Daily Challenge', time: '1 day ago', xp: 200 },
  ],
};

const SkillBar = ({ skill }) => {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{skill.name}</span>
        <span className="text-white">{skill.level}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        />
      </div>
    </div>
  );
};

const ActivityItem = ({ activity, index }) => {
  const icons = {
    course: BookOpen,
    quiz: Zap,
    challenge: Target,
  };
  
  const Icon = icons[activity.type] || Activity;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
    >
      <div className="p-2 bg-purple-500/20 rounded-lg">
        <Icon size={18} className="text-purple-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{activity.title}</p>
        <p className="text-xs text-gray-400">{activity.time}</p>
      </div>
      <span className="text-sm text-green-400 font-medium">+{activity.xp} XP</span>
    </motion.div>
  );
};

const Dashboard = ({ onClose, onOpenCalculator, onOpenBadges }) => {
  const { user, weeklyProgress, skills, recentActivities } = mockData;
  
  return (
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
        className="w-full max-w-6xl max-h-[90vh] bg-gray-900/95 rounded-2xl p-6 border border-white/10 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-gray-400">Welcome back, {user.name}! Keep up the great work!</p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatedButton variant="ghost" onClick={onOpenCalculator}>
              <BarChart3 size={18} /> Calculator
            </AnimatedButton>
            <AnimatedButton variant="ghost" onClick={onOpenBadges}>
              <Award size={18} /> Badges
            </AnimatedButton>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Current Level"
            value={user.level}
            icon={Zap}
            trend={12}
            color="purple"
          />
          <StatCard
            title="Total Savings"
            value={`₹${user.totalSavings.toLocaleString()}`}
            icon={Wallet}
            trend={8}
            color="green"
          />
          <StatCard
            title="Learning Streak"
            value={`${user.streak} days`}
            icon={Flame}
            trend={0}
            color="orange"
          />
          <StatCard
            title="Courses Done"
            value={user.coursesCompleted}
            icon={BookOpen}
            trend={25}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Level Progress */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-purple-400" />
                Level Progress
              </h3>
              <span className="text-sm text-gray-400">
                {user.xp.toLocaleString()} / {user.nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <ProgressBar progress={(user.xp / user.nextLevelXp) * 100} color="purple" className="h-4" />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Level {user.level}</span>
              <span>Level {user.level + 1}</span>
            </div>
            
            {/* Weekly Progress Chart */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Weekly Activity</h4>
              <div className="flex items-end gap-2 h-32">
                {weeklyProgress.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.xp / 700) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.xp} XP
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                {weeklyProgress.map((day) => (
                  <span key={day.day}>{day.day}</span>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Skills */}
          <GlassCard>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <PieChart size={20} className="text-blue-400" />
              Skills
            </h3>
            <div>
              {skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>
            <AnimatedButton variant="outline" className="w-full mt-4" size="sm">
              View All Skills <ChevronRight size={16} />
            </AnimatedButton>
          </GlassCard>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <GlassCard>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Activity size={20} className="text-green-400" />
              Recent Activity
            </h3>
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} index={index} />
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <AnimatedButton variant="primary" className="w-full">
            <BookOpen size={18} /> Continue Learning
          </AnimatedButton>
          <AnimatedButton variant="secondary" className="w-full">
            <Target size={18} /> Daily Challenge
          </AnimatedButton>
          <AnimatedButton variant="success" className="w-full">
            <Calendar size={18} /> Set Goals
          </AnimatedButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
