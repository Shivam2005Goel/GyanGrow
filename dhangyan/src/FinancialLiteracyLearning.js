import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, BookOpen, Trophy, Target, Flame, Clock, Star, 
  Search, Filter, ChevronRight, TrendingUp, Users,
  X, CheckCircle, Lock, Zap, Lightbulb,
  Crown, Sparkles, ArrowRight, Pause,
  ThumbsUp, Share2, Bookmark, MessageCircle,
  GraduationCap
} from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import confetti from 'canvas-confetti';
import { useTranslation } from './i18n';
import { ContributionHeatmap } from './components/ui';

const API_KEY = 'AIzaSyAsxnp7YgiJIfZWoaYkRFWIatgcrjBZh18';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Course categories with icons
const CATEGORIES = [
  { id: 'All', name: 'All Courses', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { id: 'Investing', name: 'Investing', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
  { id: 'Budgeting', name: 'Budgeting', icon: Target, color: 'from-blue-500 to-cyan-500' },
  { id: 'Credit', name: 'Credit & Loans', icon: CreditIcon, color: 'from-orange-500 to-red-500' },
  { id: 'Taxes', name: 'Tax Planning', icon: CalculatorIcon, color: 'from-yellow-500 to-amber-500' },
  { id: 'Entrepreneurship', name: 'Business', icon: Crown, color: 'from-indigo-500 to-purple-500' },
  { id: 'Retirement', name: 'Retirement', icon: Clock, color: 'from-teal-500 to-green-500' },
  { id: 'Cryptocurrency', name: 'Crypto', icon: Zap, color: 'from-pink-500 to-rose-500' },
];

// Custom icons
function CreditIcon(props) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>; }
function CalculatorIcon(props) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>; }

// Mock quiz data
const QUIZZES = {
  'Investing': [
    { q: 'What is diversification?', options: ['Investing in one stock', 'Spreading investments', 'Saving in bank'], correct: 1 },
    { q: 'What does ROI stand for?', options: ['Return on Investment', 'Risk of Investment', 'Rate of Interest'], correct: 0 },
  ],
  'Budgeting': [
    { q: 'What is the 50/30/20 rule?', options: ['50% needs, 30% wants, 20% savings', '50% savings, 30% needs, 20% wants', 'Equal split'], correct: 0 },
  ],
};

// Learning paths
const LEARNING_PATHS = [
  {
    id: 'beginner',
    title: 'Financial Beginner',
    description: 'Master the basics of personal finance',
    icon: Lightbulb,
    color: 'from-green-400 to-emerald-500',
    courses: ['Budgeting', 'Credit', 'Taxes'],
    reward: { coins: 500, badge: 'Beginner Badge' },
  },
  {
    id: 'investor',
    title: 'Smart Investor',
    description: 'Learn to grow your wealth through investing',
    icon: TrendingUp,
    color: 'from-blue-400 to-indigo-500',
    courses: ['Investing', 'Cryptocurrency'],
    reward: { coins: 1000, badge: 'Investor Badge' },
  },
  {
    id: 'entrepreneur',
    title: 'Business Owner',
    description: 'Build and scale your business',
    icon: Crown,
    color: 'from-purple-400 to-pink-500',
    courses: ['Entrepreneurship', 'Taxes'],
    reward: { coins: 1500, badge: 'Entrepreneur Badge' },
  },
];

const FinancialLiteracyLearning = ({ onClose }) => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('learning_progress');
    return saved ? JSON.parse(saved) : { completed: [], xp: 0, level: 1, streak: 0 };
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedPath, setSelectedPath] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [nextPageToken, setNextPageToken] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('learning_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Generate heatmap data for the current year
  const [activityData, setActivityData] = useState(() => {
    const saved = localStorage.getItem('learning_activity');
    if (saved) return JSON.parse(saved);
    
    // Generate sample data for demonstration
    const data = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Random activity (more recent = higher chance)
      const chance = i < 30 ? 0.7 : i < 90 ? 0.5 : 0.3;
      const hasActivity = Math.random() < chance;
      
      data.push({
        date: dateStr,
        count: hasActivity ? Math.floor(Math.random() * 5) + 1 : 0,
        xp: hasActivity ? Math.floor(Math.random() * 50) + 10 : 0,
      });
    }
    return data;
  });

  // Save progress
  useEffect(() => {
    localStorage.setItem('learning_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('learning_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Fetch courses
  useEffect(() => {
    fetchCourses();
  }, [selectedCategory]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: `${selectedCategory !== 'All' ? selectedCategory + ' finance' : 'financial literacy for beginners'}`,
          type: 'video',
          maxResults: 20,
          key: API_KEY,
        },
      });
      
      // Enrich with mock data
      const enrichedCourses = response.data.items.map((item, index) => ({
        ...item,
        difficulty: ['Beginner', 'Intermediate', 'Advanced'][index % 3],
        duration: `${Math.floor(Math.random() * 20 + 5)} min`,
        rating: (Math.random() * 1 + 4).toFixed(1),
        students: Math.floor(Math.random() * 50000 + 1000),
        xp: Math.floor(Math.random() * 50 + 20),
        category: selectedCategory === 'All' ? CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1].id : selectedCategory,
      }));
      
      setCourses(enrichedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to mock data
      setCourses(getMockCourses());
    }
    setLoading(false);
  };

  const getMockCourses = () => [
    { id: { videoId: '1' }, snippet: { title: 'Personal Finance Basics', description: 'Learn the fundamentals', thumbnails: { medium: { url: 'https://img.youtube.com/vi/0iR7x8uGNdc/mqdefault.jpg' } } }, difficulty: 'Beginner', duration: '15 min', rating: '4.8', students: 12500, xp: 30, category: 'Budgeting' },
    { id: { videoId: '2' }, snippet: { title: 'Stock Market Investing', description: 'Start your investment journey', thumbnails: { medium: { url: 'https://img.youtube.com/vi/0iR7x8uGNdc/mqdefault.jpg' } } }, difficulty: 'Intermediate', duration: '25 min', rating: '4.9', students: 8500, xp: 50, category: 'Investing' },
    { id: { videoId: '3' }, snippet: { title: 'Cryptocurrency Explained', description: 'Understanding digital currencies', thumbnails: { medium: { url: 'https://img.youtube.com/vi/0iR7x8uGNdc/mqdefault.jpg' } } }, difficulty: 'Advanced', duration: '30 min', rating: '4.7', students: 6200, xp: 60, category: 'Cryptocurrency' },
  ];

  const handleCourseSelect = (course) => {
    setCurrentVideo(course);
    setShowVideoModal(true);
    
    // Update progress
    if (!userProgress.completed.includes(course.id.videoId)) {
      setUserProgress(prev => ({
        ...prev,
        xp: prev.xp + course.xp,
        completed: [...prev.completed, course.id.videoId],
      }));
      
      // Check level up
      const newLevel = Math.floor((userProgress.xp + course.xp) / 100) + 1;
      if (newLevel > userProgress.level) {
        setUserProgress(prev => ({ ...prev, level: newLevel }));
        confetti({ particleCount: 100, spread: 70 });
      }
    }
  };

  const startQuiz = (category) => {
    const quiz = QUIZZES[category];
    if (quiz) {
      setCurrentQuiz({ questions: quiz, current: 0, score: 0 });
      setShowQuiz(true);
    }
  };

  const answerQuiz = (answer) => {
    const isCorrect = answer === currentQuiz.questions[currentQuiz.current].correct;
    const newScore = currentQuiz.score + (isCorrect ? 1 : 0);
    
    if (currentQuiz.current < currentQuiz.questions.length - 1) {
      setCurrentQuiz(prev => ({ ...prev, current: prev.current + 1, score: newScore }));
    } else {
      // Quiz complete
      const finalScore = newScore;
      const reward = finalScore === currentQuiz.questions.length ? 100 : finalScore * 20;
      setUserProgress(prev => ({ ...prev, xp: prev.xp + reward }));
      setQuizScore(finalScore);
      setTimeout(() => {
        setShowQuiz(false);
        setCurrentQuiz(null);
      }, 2000);
    }
  };

  const toggleBookmark = (courseId) => {
    setBookmarks(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => 
      course.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const completedCount = userProgress.completed.length;
  const totalCourses = courses.length;
  const progressPercent = totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0;

  // Render course card
  const CourseCard = ({ course }) => {
    const isCompleted = userProgress.completed.includes(course.id.videoId);
    const isBookmarked = bookmarks.includes(course.id.videoId);
    const categoryInfo = CATEGORIES.find(c => c.id === course.category) || CATEGORIES[0];
    const Icon = categoryInfo.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border ${isCompleted ? 'border-green-500/50' : 'border-white/10'} hover:border-white/30 transition-all cursor-pointer group`}
        onClick={() => handleCourseSelect(course)}
      >
        <div className="relative aspect-video">
          <img 
            src={course.snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${course.id.videoId}/mqdefault.jpg`} 
            alt={course.snippet.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-2 right-2 flex gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleBookmark(course.id.videoId); }}
              className={`p-1.5 rounded-full ${isBookmarked ? 'bg-yellow-500/80' : 'bg-black/50'} hover:scale-110 transition-transform`}
            >
              <Bookmark size={14} className={isBookmarked ? 'text-white fill-white' : 'text-white'} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${categoryInfo.color} text-white`}>
                {course.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/50 text-white">
                {course.difficulty}
              </span>
            </div>
          </div>
          {isCompleted && (
            <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={14} className="text-white" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">{course.snippet.title}</h3>
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{course.snippet.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400" />
              {course.rating}
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              {(course.students / 1000).toFixed(1)}k
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-purple-400 font-medium">+{course.xp} XP</span>
            <button className="flex items-center gap-1 text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">
              {isCompleted ? 'Review' : 'Start'} <Play size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="text-purple-400" />
              Learning Hub
            </h1>
            <p className="text-xs text-gray-400">Master financial literacy</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User Stats */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full">
              <Crown size={16} className="text-purple-400" />
              <span className="text-sm font-bold">Level {userProgress.level}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full">
              <Star size={16} className="text-blue-400" />
              <span className="text-sm font-bold">{userProgress.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full">
              <Flame size={16} className="text-orange-400" />
              <span className="text-sm font-bold">{userProgress.streak} Day Streak</span>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 hidden lg:block p-4 overflow-y-auto">
          {/* Progress Card */}
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 mb-6">
            <h3 className="font-bold mb-2">Your Progress</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">{completedCount} of {totalCourses}</span>
              <span className="text-purple-400">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {[
              { id: 'courses', icon: BookOpen, label: 'All Courses' },
              { id: 'paths', icon: Target, label: 'Learning Paths' },
              { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
              { id: 'achievements', icon: Trophy, label: 'Achievements' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Categories */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">Categories</h4>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setActiveTab('courses'); }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <cat.icon size={16} />
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Contribution Heatmap - Daily Streak */}
          <div className="mt-6">
            <ContributionHeatmap 
              data={activityData}
              colorScheme="purple"
              onDayClick={(day) => console.log('Clicked:', day)}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <Filter size={20} />
            </button>
          </div>

          {activeTab === 'courses' && (
            <>
              {/* Featured Section */}
              {!searchTerm && selectedCategory === 'All' && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
                  {courses[0] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-2xl overflow-hidden"
                      onClick={() => handleCourseSelect(courses[0])}
                    >
                      <img 
                        src={courses[0].snippet.thumbnails?.medium?.url} 
                        alt="Featured"
                        className="w-full h-48 md:h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="px-3 py-1 bg-purple-500 rounded-full text-xs font-bold mb-2 inline-block">Featured</span>
                        <h3 className="text-xl font-bold mb-1">{courses[0].snippet.title}</h3>
                        <p className="text-gray-300 text-sm mb-3">{courses[0].snippet.description}</p>
                        <button className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                          <Play size={16} /> Start Learning
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Course Grid */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
                  <span className="text-sm font-normal text-gray-400 ml-2">({filteredCourses.length})</span>
                </h2>
                
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="bg-white/5 rounded-2xl h-64 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCourses.map(course => (
                      <CourseCard key={course.id.videoId} course={course} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'paths' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Learning Paths</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LEARNING_PATHS.map(path => (
                  <motion.div
                    key={path.id}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                    onClick={() => setSelectedPath(path)}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4`}>
                      <path.icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{path.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{path.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {path.courses.map(c => (
                        <span key={c} className="px-2 py-1 bg-white/10 rounded text-xs">{c}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-400">Reward: {path.reward.coins} coins</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Bookmarked Courses</h2>
              {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No bookmarks yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.filter(c => bookmarks.includes(c.id.videoId)).map(course => (
                    <CourseCard key={course.id.videoId} course={course} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">{currentVideo.snippet.title}</h3>
                <button onClick={() => setShowVideoModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.id.videoId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full">
                  <ThumbsUp size={18} /> Helpful
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <MessageCircle size={18} /> Comment
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && currentQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Quiz</h3>
                <span className="text-sm text-gray-400">{currentQuiz.current + 1} / {currentQuiz.questions.length}</span>
              </div>
              <p className="text-lg mb-6">{currentQuiz.questions[currentQuiz.current].q}</p>
              <div className="space-y-3">
                {currentQuiz.questions[currentQuiz.current].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => answerQuiz(i)}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialLiteracyLearning;
