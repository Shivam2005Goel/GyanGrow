'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import DashboardOverview from '@/components/DashboardOverview';
import SearchBar from '@/components/SearchBar';
import ProcessGPS from '@/components/ProcessGPS';
import PulseDashboard from '@/components/PulseDashboard';
import SmartBriefing from '@/components/SmartBriefing';
import FocusMode from '@/components/FocusMode';
import FileShare from '@/components/FileShare';
import OracleSearch from '@/components/OracleSearch';
import AnswerKeyManager from '@/components/AnswerKeyManager';
import StudyMaterials from '@/components/StudyMaterials';
import CareerHub from '@/components/CareerHub';
import LostAndFound from '@/components/LostAndFound';
import TimetableHelper from '@/components/TimetableHelper';
import RoommateMatch from '@/components/RoommateMatch';
import NoteShare from '@/components/NoteShare';
import AdminAutomation from '@/components/AdminAutomation';
import GroupStudy from '@/components/GroupStudy';
import QuickPoll from '@/components/QuickPoll';
import ClubsEvents from '@/components/ClubsEvents';
import StudyBuddy from '@/components/StudyBuddy';
import BudgetTracker from '@/components/BudgetTracker';
import AttendanceTracker from '@/components/AttendanceTracker';
import AiMockInterview from '@/components/AiMockInterview';
import MrVighelp from '@/components/MrVighelp';
import GovSchemes from '@/components/GovSchemes';
import AiRoadmap from '@/components/AiRoadmap';
import CampusExplorer from '@/components/CampusExplorer';
import VisualAlgorithms from '@/components/VisualAlgorithms';
import { AnimatedAIChat } from '@/components/ui/animated-ai-chat';
import FlashcardMaker from '@/components/FlashcardMaker';
import ExamCountdown from '@/components/ExamCountdown';
import PomodoroTimer from '@/components/PomodoroTimer';
import GPACalculator from '@/components/GPACalculator';
import PartnerMatch from '@/components/PartnerMatch';
import TravelPool from '@/components/TravelPool';
import ARVRFeatures from '@/components/ARVRFeatures';
import DhanGyanHome from '@/components/DhanGyanHome';
import DhanGyanGames from '@/components/DhanGyanGames';
import DhanGyanLearning from '@/components/DhanGyanLearning';
import DhanGyanMarketplace from '@/components/DhanGyanMarketplace';
import DhanGyanZones from '@/components/DhanGyanZones';
import DhanGyanSkills from '@/components/DhanGyanSkills';
import DhanGyanLeaderboard from '@/components/DhanGyanLeaderboard';

const BootScreen = dynamic(() => import('@/components/BootScreen'), { ssr: false });

export default function Home() {
  const [landingState, setLandingState] = useState<'dhangyan' | 'booting' | 'app'>('dhangyan');
  const [activeSection, setActiveSection] = useState('dashboard');

  // Listen for custom navigate events from dashboard widgets
  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail) setActiveSection(e.detail);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const handleStartJourney = useCallback((section?: string) => {
    if (section && typeof section === 'string') {
      setActiveSection(section);
    }
    setLandingState('booting');
  }, []);

  const handleBootComplete = useCallback(() => {
    setLandingState('app');
  }, []);

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'dg-games':
        return <DhanGyanGames onNavigate={setActiveSection} />;
      case 'dg-learning':
        return <DhanGyanLearning onNavigate={setActiveSection} />;
      case 'dg-marketplace':
        return <DhanGyanMarketplace />;
      case 'dg-roadmap':
        return <AiRoadmap />;
      case 'dg-zonal':
        return <DhanGyanZones />;
      case 'dg-skills':
        return <DhanGyanSkills />;
      case 'dg-leaderboard':
        return <DhanGyanLeaderboard />;
      case 'dhangyan':
        return <DhanGyanHome onNavigate={setActiveSection} />;
      case 'timetable':
        return <TimetableHelper />;
      case 'search':
        return <OracleSearch />;
      case 'campus':
        return <CampusExplorer />;
      case 'process':
        return <ProcessGPS />;
      case 'pulse':
        return <PulseDashboard />;
      case 'briefing':
        return <SmartBriefing fullPage />;
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white/90">Profile</h2>
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-xl shadow-violet-500/20">
                AU
              </div>
              <h3 className="text-lg font-bold text-white/80">Ayush Upadhyay</h3>
              <p className="text-sm text-white/40">BTech CSE AIML · 3rd Year</p>
              <p className="text-xs text-white/25 mt-1">ayush.upadhyay@gyangrow.edu · STU-2023-0847</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-cyan-400">3.72</p>
                  <p className="text-[11px] text-white/30">GPA</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-violet-400">1,250</p>
                  <p className="text-[11px] text-white/30">XP Points</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-2xl font-bold text-emerald-400">74</p>
                  <p className="text-[11px] text-white/30">RUVI</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'fileshare':
        return <FileShare />;
      case 'study-materials':
        return <StudyMaterials />;
      case 'career':
        return <CareerHub />;
      case 'lost-found':
        return <LostAndFound />;
      case 'clubs-events':
        return <ClubsEvents />;
      case 'roommate':
        return <RoommateMatch />;
      case 'note-share':
        return <NoteShare />;
      case 'admin-automation':
        return <AdminAutomation />;
      case 'gov-schemes':
        return <GovSchemes />;
      case 'group-study':
        return <GroupStudy />;
      case 'quick-poll':
        return <QuickPoll />;
      case 'study-buddy':
        return <StudyBuddy />;
      case 'budget':
        return <BudgetTracker />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'focus':
        return <DashboardOverview />; // Render dashboard underneath the focus overlay
      case 'answer-key':
        return <AnswerKeyManager />;
      case 'mock-interview':
        return <AiMockInterview />;
      case 'ai-chat':
        return <AnimatedAIChat />;
      case 'visual-algos':
        return <VisualAlgorithms />;
      case 'ai-roadmap':
        return <AiRoadmap />;
      case 'flashcards':
        return <FlashcardMaker />;
      case 'exam-countdown':
        return <ExamCountdown />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'gpa':
        return <GPACalculator />;
      case 'partner-match':
        return <PartnerMatch />;
      case 'travel-pool':
        return <TravelPool />;
      case 'ar-vr':
        return <ARVRFeatures />;
      default:
        return <DashboardOverview />;
    }
  };

  // Landing and Boot screen
  if (landingState === 'dhangyan') {
    return <DhanGyanHome onNavigate={handleStartJourney} />;
  }

  if (landingState === 'booting') {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div className="flex h-screen bg-[#040812] aurora-bg overflow-hidden relative perspective-3d">
      {/* Ambient glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotateZ: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.04] blur-[150px] pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          rotateZ: [0, -180, -360]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/[0.04] blur-[120px] pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Floating 3D geometric shapes */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="fixed top-1/4 right-10 w-20 h-20 border border-cyan-500/20 rounded-2xl pointer-events-none backdrop-blur-sm"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px) rotateX(45deg) rotateY(45deg)'
        }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotateX: [0, -360],
          rotateZ: [0, 360],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="fixed bottom-1/4 left-10 w-16 h-16 border border-violet-500/20 rounded-full pointer-events-none backdrop-blur-sm"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px)'
        }}
      />

      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Primary content */}
        <main className={`flex-1 overflow-y-auto ${activeSection === 'campus' || activeSection === 'gov-schemes' || activeSection === 'ar-vr' || activeSection.startsWith('dg-') ? 'p-0 relative h-full' : 'p-6 lg:p-8'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`${activeSection === 'campus' || activeSection === 'gov-schemes' || activeSection === 'ar-vr' || activeSection.startsWith('dg-') ? 'w-full h-full' : 'max-w-5xl mx-auto'} animate-in`}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {activeSection === 'focus' && (
          <FocusMode onClose={() => setActiveSection('dashboard')} />
        )}
      </AnimatePresence>
      <MrVighelp />
    </div>
  );
}
