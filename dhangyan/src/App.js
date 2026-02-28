import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Menu, X, Target, BookOpen,
  Trophy, Gamepad2, ShoppingBag, Home, Map,
  Globe, Brain
} from 'lucide-react';

// UI Components
// UI Components
// import { GlassCard, AnimatedButton, SectionTitle } from './components/ui';
import { GradientOrbs, ParticleBackground } from './components/ui/ParticleBackground';
import { ToastProvider, useToast } from './components/features/ToastContainer';

// Gaming Components
import AvatarSystem from './components/gaming/AvatarSystem';
import { CompactXPDisplay } from './components/gaming/XPDisplay';
import QuestSystem from './components/gaming/QuestSystem';

import VirtualShop from './components/gaming/VirtualShop';
import EnhancedLeaderboard from './components/gaming/EnhancedLeaderboard';
import DailyRewards from './components/gaming/DailyRewards';
import EnhancedProfile from './components/gaming/EnhancedProfile';

// Existing Components
import AIChat from './AIChat';
import FinancialQuiz from './FinancialQuiz';
import FinancialLiteracyLearning from './FinancialLiteracyLearning';
import AIMarketplace from './AIMarketplace';
import LoginSignupPage from './LoginSignupPage';

// Page Components
import GamesPage from './pages/GamesPage';
import RoadmapPage from './pages/RoadmapPage';
import ZonalLearningPage from './pages/ZonalLearningPage';
import SkillsPage from './pages/SkillsPage';
import HomePage from './pages/HomePage';


// Custom Hooks
import { useAOS } from './utils/aosHelpers';
import FloatingLines from './components/common/FloatingLines';

// I18n
import { I18nProvider } from './i18n';

// Mock User Data
const mockUser = {
  name: 'Player',
  level: 15,
  xp: 7500,
  coins: 5250,
  gems: 25,
  streak: 7,
  character: 'wizard',
  tier: 'Gold',
  coursesCompleted: 12,
  questsCompleted: 45,
  achievements: 8,
};

const Navbar = ({ user, onOpenSidebar, onOpenProfile }) => (
  <motion.header
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
    style={{
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}
  >
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSidebar}
          className="p-2 hover:bg-white/10 rounded-full"
        >
          <Menu size={24} />
        </motion.button>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Dhan Gyan
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <CompactXPDisplay user={user} />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl"
        >
          {user?.avatar || '👤'}
        </motion.button>
      </div>
    </div>
  </motion.header>
);

const AppContent = () => {
  const [user, setUser] = useState(mockUser);
  const [showLogin, setShowLogin] = useState(false);
  const [, setIsLoggedIn] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  // Modal States
  const [modals, setModals] = useState({
    avatar: false,
    quests: false,
    games: false,
    shop: false,
    leaderboard: false,
    rewards: false,
    learning: false,
    quiz: false,
    marketplace: false,
    profile: false,
  });

  const { addToast } = useToast();

  const openModal = (name) => {
    setModals(prev => ({ ...prev, [name]: true }));
  };

  const closeModal = (name) => {
    setModals(prev => ({ ...prev, [name]: false }));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    addToast('Welcome to Dhan Gyan! 🎉', 'success');
    confetti({ particleCount: 150, spread: 100 });
  };

  const handleUpdateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    addToast('Profile updated!', 'success');
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Background Effects */}
      <GradientOrbs />
      <ParticleBackground particleCount={25} />

      {/* Navigation */}
      <Navbar
        user={user}
        onOpenSidebar={() => setShowSidebar(true)}
        onOpenProfile={() => openModal('avatar')}
      />

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-gray-900/70 backdrop-blur-xl border-r border-white/10 z-50 overflow-y-auto"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-2">
                {[
                  { icon: Home, label: 'Home', onClick: () => setShowSidebar(false) },
                  { icon: Target, label: 'Quests', onClick: () => { openModal('quests'); setShowSidebar(false); } },
                  { icon: Gamepad2, label: 'Games', onClick: () => { navigate('/games'); setShowSidebar(false); } },
                  { icon: BookOpen, label: 'Learning', onClick: () => { navigate('/learning'); setShowSidebar(false); } },
                  { icon: ShoppingBag, label: 'Marketplace', onClick: () => { navigate('/marketplace'); setShowSidebar(false); } },
                  { icon: Map, label: 'AI Roadmap', onClick: () => { navigate('/roadmap'); setShowSidebar(false); } },
                  { icon: Globe, label: 'Zonal Learning', onClick: () => { navigate('/zones'); setShowSidebar(false); } },
                  { icon: Brain, label: 'Skills', onClick: () => { navigate('/skills'); setShowSidebar(false); } },
                  { icon: Trophy, label: 'Leaderboard', onClick: () => { openModal('leaderboard'); setShowSidebar(false); } },
                ].map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={item.onClick}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <item.icon size={20} className="text-purple-400" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10">
        <HomePage
          user={user}
          onStart={() => setShowLogin(true)}
          navigate={navigate}
          openModal={openModal}
        />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Dhan Gyan
            </h3>
            <p className="text-gray-400 mb-6">
              Gamifying Financial Literacy for Bharat
            </p>
            <div className="flex justify-center gap-6">
              {['About', 'Features', 'Community', 'Support'].map((link) => (
                <button key={link} className="text-gray-400 hover:text-white transition-colors">
                  {link}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-8">
              © 2024 Dhan Gyan. Made with ❤️ for Bharat
            </p>
          </div>
        </footer>
      </main>

      {/* AI Chat */}
      <AIChat />

      {/* Modals */}
      <AnimatePresence>
        {showLogin && (
          <LoginSignupPage onLogin={handleLogin} onClose={() => setShowLogin(false)} />
        )}

        {modals.avatar && (
          <AvatarSystem
            user={user}
            onClose={() => closeModal('avatar')}
            onUpdate={handleUpdateUser}
          />
        )}

        {modals.quests && (
          <QuestSystem user={user} onClose={() => closeModal('quests')} />
        )}

        {modals.games && (
          <GamesPage user={user} onClose={() => closeModal('games')} />
        )}

        {modals.shop && (
          <VirtualShop
            user={user}
            onClose={() => closeModal('shop')}
            onPurchase={(item) => addToast(`Purchased ${item.name}!`, 'success')}
          />
        )}

        {modals.leaderboard && (
          <EnhancedLeaderboard user={user} onClose={() => closeModal('leaderboard')} />
        )}

        {modals.rewards && (
          <DailyRewards
            user={user}
            onClose={() => closeModal('rewards')}
            onClaim={(reward) => {
              addToast(`Claimed ${reward.coins} coins!`, 'success');
              confetti({ particleCount: 100 });
            }}
          />
        )}

        {modals.learning && (
          <FinancialLiteracyLearning
            onClose={() => closeModal('learning')}
          />
        )}

        {modals.quiz && (
          <FinancialQuiz
            user={user}
            onClose={() => closeModal('quiz')}
          />
        )}

        {modals.marketplace && (
          <AIMarketplace
            onClose={() => closeModal('marketplace')}
          />
        )}

        {modals.profile && (
          <EnhancedProfile
            user={user}
            onClose={() => closeModal('profile')}
            onUpdate={(updates) => setUser(prev => ({ ...prev, ...updates }))}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  // Initialize AOS for scroll animations
  useAOS();

  return (
    <BrowserRouter>
      <>
        {/* FloatingLines Background - Fixed Layer */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none', // Don't block clicks on content
          }}
        >
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={5}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
            animationSpeed={0.8}
            mouseDamping={0.05}
            parallaxStrength={0.15}
            mixBlendMode="screen"
          />
        </div>

        {/* Main Content with routing */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <I18nProvider>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<AppContent />} />
                <Route path="/games" element={<GamesPage user={mockUser} />} />
                <Route path="/learning" element={<FinancialLiteracyLearning onClose={() => window.history.back()} />} />
                <Route path="/marketplace" element={<AIMarketplace onClose={() => window.history.back()} />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/zones" element={<ZonalLearningPage />} />
                <Route path="/skills" element={<SkillsPage />} />
              </Routes>
            </ToastProvider>
          </I18nProvider>
        </div>
      </>
    </BrowserRouter>
  );
};

export default App;
