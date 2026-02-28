import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial skills data
const initialSkillsState = {
  categories: {
    investing: {
      name: "Investing & Trading",
      icon: "TrendingUp",
      color: "from-green-500 to-emerald-500",
      skills: [
        {
          id: "stock-basics",
          name: "Stock Market Basics",
          description: "Learn fundamental concepts of stock trading and market analysis",
          level: 1,
          maxLevel: 5,
          xp: 450,
          maxXp: 500,
          estimatedTime: "2 weeks",
          modules: [
            { id: 1, name: "Introduction to Stock Markets", completed: true, duration: "30 min" },
            { id: 2, name: "Understanding Stock Exchanges", completed: true, duration: "45 min" },
            { id: 3, name: "Types of Stocks", completed: true, duration: "40 min" },
            { id: 4, name: "Market Indices", completed: true, duration: "35 min" },
            { id: 5, name: "Trading vs Investing", completed: true, duration: "50 min" },
            { id: 6, name: "Order Types", completed: true, duration: "40 min" },
            { id: 7, name: "Brokerage Accounts", completed: true, duration: "30 min" },
            { id: 8, name: "First Trade Simulation", completed: false, duration: "60 min" }
          ],
          badges: ["Market Novice", "First Trade"],
          icon: "BarChart3",
          locked: false,
          prerequisites: [],
          resources: [
            { type: "video", title: "Stock Market 101", duration: "15 min" },
            { type: "article", title: "Understanding BSE & NSE", readTime: "10 min" },
            { type: "quiz", title: "Market Basics Quiz", questions: 10 }
          ]
        },
        {
          id: "technical-analysis",
          name: "Technical Analysis",
          description: "Master chart patterns, indicators, and price action strategies",
          level: 2,
          maxLevel: 5,
          xp: 320,
          maxXp: 1000,
          estimatedTime: "4 weeks",
          modules: [
            { id: 1, name: "Candlestick Patterns", completed: true, duration: "60 min" },
            { id: 2, name: "Support & Resistance", completed: true, duration: "45 min" },
            { id: 3, name: "Trend Lines", completed: true, duration: "40 min" },
            { id: 4, name: "Moving Averages", completed: false, duration: "50 min" },
            { id: 5, name: "RSI & MACD", completed: false, duration: "55 min" },
            { id: 6, name: "Volume Analysis", completed: false, duration: "40 min" },
            { id: 7, name: "Chart Patterns", completed: false, duration: "60 min" },
            { id: 8, name: "Fibonacci Retracement", completed: false, duration: "45 min" },
            { id: 9, name: "Risk Management", completed: false, duration: "50 min" },
            { id: 10, name: "Building a Trading Plan", completed: false, duration: "60 min" },
            { id: 11, name: "Backtesting Strategies", completed: false, duration: "55 min" },
            { id: 12, name: "Live Trading Session", completed: false, duration: "90 min" }
          ],
          badges: ["Chart Master"],
          icon: "TrendingDown",
          locked: false,
          prerequisites: ["stock-basics"],
          resources: [
            { type: "video", title: "Chart Patterns Explained", duration: "25 min" },
            { type: "interactive", title: "Pattern Recognition Tool", duration: "Unlimited" }
          ]
        },
        {
          id: "fundamental-analysis",
          name: "Fundamental Analysis",
          description: "Analyze company financials and economic indicators",
          level: 0,
          maxLevel: 5,
          xp: 0,
          maxXp: 500,
          estimatedTime: "3 weeks",
          modules: [
            { id: 1, name: "Financial Statements Overview", completed: false, duration: "45 min" },
            { id: 2, name: "Balance Sheet Analysis", completed: false, duration: "50 min" },
            { id: 3, name: "Income Statement", completed: false, duration: "45 min" },
            { id: 4, name: "Cash Flow Analysis", completed: false, duration: "40 min" },
            { id: 5, name: "Key Financial Ratios", completed: false, duration: "60 min" },
            { id: 6, name: "Valuation Methods", completed: false, duration: "55 min" },
            { id: 7, name: "Industry Analysis", completed: false, duration: "45 min" },
            { id: 8, name: "Economic Indicators", completed: false, duration: "50 min" },
            { id: 9, name: "Company Moat Analysis", completed: false, duration: "40 min" },
            { id: 10, name: "Building a Watchlist", completed: false, duration: "30 min" }
          ],
          badges: [],
          icon: "FileText",
          locked: false,
          prerequisites: ["stock-basics"],
          resources: []
        },
        {
          id: "options-trading",
          name: "Options Trading",
          description: "Advanced strategies using options contracts",
          level: 0,
          maxLevel: 5,
          xp: 0,
          maxXp: 1000,
          estimatedTime: "6 weeks",
          modules: Array(15).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Options Module ${i + 1}`,
            completed: false,
            duration: "60 min"
          })),
          badges: [],
          icon: "Target",
          locked: true,
          prerequisites: ["technical-analysis", "fundamental-analysis"],
          resources: []
        },
        {
          id: "portfolio-management",
          name: "Portfolio Management",
          description: "Build and manage diversified investment portfolios",
          level: 0,
          maxLevel: 5,
          xp: 0,
          maxXp: 1000,
          estimatedTime: "5 weeks",
          modules: Array(12).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Portfolio Module ${i + 1}`,
            completed: false,
            duration: "60 min"
          })),
          badges: [],
          icon: "Wallet",
          locked: true,
          prerequisites: ["fundamental-analysis"],
          resources: []
        }
      ]
    },
    personalFinance: {
      name: "Personal Finance",
      icon: "PiggyBank",
      color: "from-blue-500 to-cyan-500",
      skills: [
        {
          id: "budgeting",
          name: "Budgeting Mastery",
          description: "Create and maintain effective personal budgets",
          level: 3,
          maxLevel: 5,
          xp: 780,
          maxXp: 1500,
          estimatedTime: "2 weeks",
          modules: [
            { id: 1, name: "Understanding Cash Flow", completed: true, duration: "30 min" },
            { id: 2, name: "50-30-20 Rule", completed: true, duration: "25 min" },
            { id: 3, name: "Tracking Expenses", completed: true, duration: "40 min" },
            { id: 4, name: "Budgeting Tools", completed: true, duration: "35 min" },
            { id: 5, name: "Emergency Fund Planning", completed: true, duration: "45 min" },
            { id: 6, name: "Advanced Budgeting Strategies", completed: true, duration: "50 min" }
          ],
          badges: ["Budget Pro", "Savings Star"],
          icon: "Calculator",
          locked: false,
          prerequisites: [],
          resources: [
            { type: "calculator", title: "Budget Calculator", description: "Plan your monthly budget" },
            { type: "template", title: "Budget Spreadsheet", description: "Downloadable template" }
          ]
        },
        {
          id: "debt-management",
          name: "Debt Management",
          description: "Strategies to eliminate debt and improve credit score",
          level: 2,
          maxLevel: 5,
          xp: 450,
          maxXp: 1000,
          estimatedTime: "3 weeks",
          modules: [
            { id: 1, name: "Types of Debt", completed: true, duration: "30 min" },
            { id: 2, name: "Interest Rate Mathematics", completed: true, duration: "45 min" },
            { id: 3, name: "Debt Avalanche Method", completed: true, duration: "35 min" },
            { id: 4, name: "Debt Snowball Method", completed: true, duration: "35 min" },
            { id: 5, name: "Credit Score Factors", completed: false, duration: "40 min" },
            { id: 6, name: "Improving Credit Score", completed: false, duration: "45 min" },
            { id: 7, name: "Debt Consolidation", completed: false, duration: "35 min" },
            { id: 8, name: "Negotiating with Creditors", completed: false, duration: "40 min" }
          ],
          badges: ["Debt Slayer"],
          icon: "Shield",
          locked: false,
          prerequisites: ["budgeting"],
          resources: [
            { type: "calculator", title: "Debt Payoff Calculator", description: "Plan your debt freedom" }
          ]
        },
        {
          id: "tax-planning",
          name: "Tax Planning",
          description: "Optimize tax savings through legal deductions and investments",
          level: 1,
          maxLevel: 5,
          xp: 200,
          maxXp: 500,
          estimatedTime: "4 weeks",
          modules: Array(10).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Tax Module ${i + 1}`,
            completed: i < 2,
            duration: "45 min"
          })),
          badges: [],
          icon: "FileText",
          locked: false,
          prerequisites: ["budgeting"],
          resources: []
        },
        {
          id: "retirement-planning",
          name: "Retirement Planning",
          description: "Plan for a secure financial future and retirement",
          level: 0,
          maxLevel: 5,
          xp: 0,
          maxXp: 1000,
          estimatedTime: "5 weeks",
          modules: Array(12).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Retirement Module ${i + 1}`,
            completed: false,
            duration: "50 min"
          })),
          badges: [],
          icon: "Clock",
          locked: true,
          prerequisites: ["tax-planning", "debt-management"],
          resources: [
            { type: "calculator", title: "Retirement Calculator", description: "Plan your retirement corpus" }
          ]
        }
      ]
    },
    fintech: {
      name: "FinTech & Digital",
      icon: "Cpu",
      color: "from-purple-500 to-pink-500",
      skills: [
        {
          id: "crypto-basics",
          name: "Cryptocurrency Basics",
          description: "Understand blockchain technology and digital assets",
          level: 1,
          maxLevel: 5,
          xp: 380,
          maxXp: 500,
          estimatedTime: "3 weeks",
          modules: Array(8).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Crypto Module ${i + 1}`,
            completed: i < 6,
            duration: "40 min"
          })),
          badges: ["Crypto Curious"],
          icon: "Coins",
          locked: false,
          prerequisites: [],
          resources: []
        },
        {
          id: "defi",
          name: "DeFi & Web3",
          description: "Explore decentralized finance and Web3 applications",
          level: 0,
          maxLevel: 5,
          xp: 0,
          maxXp: 1000,
          estimatedTime: "5 weeks",
          modules: Array(12).fill(null).map((_, i) => ({
            id: i + 1,
            name: `DeFi Module ${i + 1}`,
            completed: false,
            duration: "55 min"
          })),
          badges: [],
          icon: "Globe",
          locked: false,
          prerequisites: ["crypto-basics"],
          resources: []
        },
        {
          id: "digital-payments",
          name: "Digital Payments",
          description: "Master UPI, wallets, and digital payment systems",
          level: 2,
          maxLevel: 5,
          xp: 600,
          maxXp: 1000,
          estimatedTime: "2 weeks",
          modules: Array(6).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Payments Module ${i + 1}`,
            completed: true,
            duration: "30 min"
          })),
          badges: ["Digital Native"],
          icon: "CreditCard",
          locked: false,
          prerequisites: [],
          resources: []
        }
      ]
    },
    business: {
      name: "Business Finance",
      icon: "Building2",
      color: "from-orange-500 to-amber-500",
      skills: [
        {
          id: "financial-statements",
          name: "Financial Statements",
          description: "Read and interpret balance sheets and income statements",
          level: 1,
          maxLevel: 5,
          xp: 280,
          maxXp: 500,
          estimatedTime: "3 weeks",
          modules: Array(8).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Statements Module ${i + 1}`,
            completed: i < 4,
            duration: "40 min"
          })),
          badges: [],
          icon: "FileText",
          locked: false,
          prerequisites: [],
          resources: []
        },
        {
          id: "business-valuation",
          name: "Business Valuation",
          description: "Learn methods to value businesses and startups",
          level: 0,
          maxLevel: 5,
          xp: 0,
          maxXp: 1000,
          estimatedTime: "6 weeks",
          modules: Array(15).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Valuation Module ${i + 1}`,
            completed: false,
            duration: "60 min"
          })),
          badges: [],
          icon: "Landmark",
          locked: true,
          prerequisites: ["financial-statements", "fundamental-analysis"],
          resources: []
        },
        {
          id: "startup-funding",
          name: "Startup Funding",
          description: "Raising capital and managing investor relations",
          level: 0,
          maxLevel: 5,
          xp: 0,
          maxXp: 1000,
          estimatedTime: "4 weeks",
          modules: Array(10).fill(null).map((_, i) => ({
            id: i + 1,
            name: `Funding Module ${i + 1}`,
            completed: false,
            duration: "50 min"
          })),
          badges: [],
          icon: "Target",
          locked: false,
          prerequisites: ["financial-statements"],
          resources: []
        }
      ]
    }
  },
  userStats: {
    totalXp: 2570,
    level: 5,
    streakDays: 12,
    skillsCompleted: 3,
    skillsInProgress: 4,
    certificatesEarned: 2,
    hoursLearned: 48,
    weeklyGoal: 10,
    weeklyProgress: 7
  },
  achievements: [
    { id: 1, name: "First Steps", description: "Complete your first module", earned: true, icon: "🎯" },
    { id: 2, name: "Consistent Learner", description: "7-day learning streak", earned: true, icon: "🔥" },
    { id: 3, name: "Skill Master", description: "Reach level 5 in any skill", earned: false, icon: "🏆" },
    { id: 4, name: "Diversified", description: "Start learning in 3 categories", earned: true, icon: "🌟" },
    { id: 5, name: "Quiz Champion", description: "Score 100% on 5 quizzes", earned: false, icon: "🧠" }
  ],
  recentActivity: [
    { type: "module_complete", skill: "Budgeting Mastery", module: "Emergency Fund Planning", xp: 50, time: "2 hours ago" },
    { type: "xp_earned", amount: 100, source: "Daily Challenge", time: "5 hours ago" },
    { type: "badge_earned", badge: "Savings Star", time: "1 day ago" },
    { type: "streak", days: 12, time: "1 day ago" }
  ]
};

// Action types
const ACTIONS = {
  COMPLETE_MODULE: 'COMPLETE_MODULE',
  ADD_XP: 'ADD_XP',
  LEVEL_UP: 'LEVEL_UP',
  UNLOCK_SKILL: 'UNLOCK_SKILL',
  UPDATE_WEEKLY_PROGRESS: 'UPDATE_WEEKLY_PROGRESS',
  ADD_BADGE: 'ADD_BADGE'
};

// Reducer
function skillsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.COMPLETE_MODULE: {
      const { categoryId, skillId, moduleId } = action.payload;
      const newCategories = { ...state.categories };
      const skill = newCategories[categoryId].skills.find(s => s.id === skillId);
      const module = skill.modules.find(m => m.id === moduleId);
      module.completed = true;
      
      // Calculate new XP
      const xpGain = 50;
      skill.xp += xpGain;
      
      // Check for level up
      if (skill.xp >= skill.maxXp && skill.level < skill.maxLevel) {
        skill.level += 1;
        skill.xp = skill.xp - skill.maxXp;
        skill.maxXp = Math.floor(skill.maxXp * 1.5);
      }
      
      // Update user stats
      const newStats = {
        ...state.userStats,
        totalXp: state.userStats.totalXp + xpGain,
        hoursLearned: state.userStats.hoursLearned + 0.5
      };
      
      // Add activity
      const newActivity = {
        type: "module_complete",
        skill: skill.name,
        module: module.name,
        xp: xpGain,
        time: "Just now"
      };
      
      return {
        ...state,
        categories: newCategories,
        userStats: newStats,
        recentActivity: [newActivity, ...state.recentActivity.slice(0, 9)]
      };
    }
    
    case ACTIONS.ADD_XP: {
      return {
        ...state,
        userStats: {
          ...state.userStats,
          totalXp: state.userStats.totalXp + action.payload.amount
        }
      };
    }
    
    case ACTIONS.UPDATE_WEEKLY_PROGRESS: {
      return {
        ...state,
        userStats: {
          ...state.userStats,
          weeklyProgress: Math.min(state.userStats.weeklyProgress + action.payload.hours, state.userStats.weeklyGoal)
        }
      };
    }
    
    default:
      return state;
  }
}

// Context
const SkillsContext = createContext(null);

// Provider
export function SkillsProvider({ children }) {
  const [state, dispatch] = useReducer(skillsReducer, initialSkillsState);
  
  const completeModule = useCallback((categoryId, skillId, moduleId) => {
    dispatch({ type: ACTIONS.COMPLETE_MODULE, payload: { categoryId, skillId, moduleId } });
  }, []);
  
  const addXp = useCallback((amount) => {
    dispatch({ type: ACTIONS.ADD_XP, payload: { amount } });
  }, []);
  
  const updateWeeklyProgress = useCallback((hours) => {
    dispatch({ type: ACTIONS.UPDATE_WEEKLY_PROGRESS, payload: { hours } });
  }, []);
  
  const getSkillProgress = useCallback((categoryId, skillId) => {
    const category = state.categories[categoryId];
    if (!category) return null;
    const skill = category.skills.find(s => s.id === skillId);
    if (!skill) return null;
    
    const completedModules = skill.modules.filter(m => m.completed).length;
    const totalModules = skill.modules.length;
    const progress = (completedModules / totalModules) * 100;
    
    return {
      ...skill,
      completedModules,
      totalModules,
      progress,
      categoryName: category.name,
      categoryColor: category.color
    };
  }, [state.categories]);
  
  const getAllSkills = useCallback(() => {
    return Object.entries(state.categories).flatMap(([key, cat]) => 
      cat.skills.map(skill => ({
        ...skill,
        categoryKey: key,
        categoryName: cat.name,
        categoryColor: cat.color,
        completedModules: skill.modules.filter(m => m.completed).length,
        totalModules: skill.modules.length,
        progress: (skill.modules.filter(m => m.completed).length / skill.modules.length) * 100
      }))
    );
  }, [state.categories]);
  
  const value = {
    ...state,
    completeModule,
    addXp,
    updateWeeklyProgress,
    getSkillProgress,
    getAllSkills
  };
  
  return (
    <SkillsContext.Provider value={value}>
      {children}
    </SkillsContext.Provider>
  );
}

// Hook
export function useSkills() {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
}
