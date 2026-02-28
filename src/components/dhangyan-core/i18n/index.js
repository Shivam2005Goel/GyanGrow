import React, { createContext, useContext, useState, useCallback } from 'react';

// Supported languages
export const LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
};

// Translation dictionary
const translations = {
  en: {
    // Common
    common: {
      back: 'Back',
      close: 'Close',
      play: 'Play',
      playAgain: 'Play Again',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      coins: 'Coins',
      gems: 'Gems',
      xp: 'XP',
      level: 'Level',
      score: 'Score',
      time: 'Time',
      moves: 'Moves',
      attempts: 'Attempts',
      wins: 'Wins',
      losses: 'Losses',
      streak: 'Streak',
      multiplier: 'Multiplier',
      bonus: 'Bonus',
      reward: 'Reward',
      claim: 'Claim',
      shop: 'Shop',
      stats: 'Stats',
      achievements: 'Achievements',
      settings: 'Settings',
      help: 'Help',
      sound: 'Sound',
      music: 'Music',
      language: 'Language',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      reset: 'Reset',
      pause: 'Pause',
      resume: 'Resume',
      quit: 'Quit',
      start: 'Start',
      finish: 'Finish',
      continue: 'Continue',
      skip: 'Skip',
      hint: 'Hint',
      hints: 'Hints',
      buy: 'Buy',
      sell: 'Sell',
      price: 'Price',
      total: 'Total',
      profit: 'Profit',
      loss: 'Loss',
      balance: 'Balance',
      portfolio: 'Portfolio',
      cash: 'Cash',
    },

    // Games Page
    games: {
      title: 'Financial Arcade',
      subtitle: 'Play games, win rewards, master finance!',
      selectGame: 'Select a Game',
      gameCategories: {
        luck: 'Luck',
        skill: 'Skill',
        edu: 'Education',
        sim: 'Simulation',
      },
    },

    // Individual Games
    gamesList: {
      stockmarket: {
        name: 'Stock Market Pro',
        description: 'Real-time trading with candlestick charts',
        tutorial: {
          title: 'Stock Market Simulator',
          goal: 'Maximize your profits in 3 minutes',
          start: '₹10,000 cash',
          candlesticks: 'Green = Up, Red = Down',
          indicators: 'MA20 (blue), MA50 (orange)',
          strategy: 'Buy low, sell high!',
        },
        time: 'Time',
        balance: 'Balance',
        holdings: 'Holdings',
        pnl: 'P&L',
        buy: 'BUY',
        sell: 'SELL',
        quantity: 'Quantity',
        currentPrice: 'Current Price',
        news: 'NEWS',
        tradeHistory: 'Recent Trades',
        startTrading: 'Start Trading',
        pause: 'Pause',
        resume: 'Resume',
        exit: 'Exit',
      },
      spin: {
        name: 'Lucky Spin',
        description: 'Spin the wheel to win coins & gems',
        spinsLeft: 'Spins left',
        spin: 'Spin',
        spinning: 'Spinning...',
        jackpot: 'Jackpot!',
        youWon: 'You won',
        tryAgain: 'Try Again',
        prizes: {
          coins50: '50 Coins',
          coins75: '75 Coins',
          coins200: '200 Coins',
          xp100: '100 XP',
          gem1: '1 Gem',
          jackpot: 'Jackpot!',
          doubleXP: '2x XP',
        },
      },
      memory: {
        name: 'Memory Match',
        description: 'Match symbols to win rewards',
        timeLeft: 'Time left',
        moves: 'Moves',
        matched: 'Matched',
        excellent: 'Excellent Memory!',
        timeBonus: 'Time Bonus',
        moveBonus: 'Move Bonus',
        frozen: 'FROZEN',
      },
      number: {
        name: 'Number Guess',
        description: 'Guess the secret number',
        guess: 'Guess',
        enterNumber: 'Enter 1-100',
        tooLow: '📈 Too low!',
        tooHigh: '📉 Too high!',
        correct: '🎉 Correct! You won!',
        gameOver: 'Game Over!',
        theNumberWas: 'The number was',
        tries: 'tries',
      },
      investment: {
        name: 'Investment Tycoon',
        description: 'Build your wealth through smart investments',
        day: 'Day',
        of: 'of',
        news: 'News',
        marketOpens: 'Market opens... Start investing!',
        assets: {
          stocks: 'Tech Stocks',
          crypto: 'Crypto',
          gold: 'Gold',
        },
        events: {
          stable: 'Market stable',
          techBoom: 'Tech boom!',
          cryptoSurge: 'Crypto surge',
          goldRises: 'Gold rises',
          correction: 'Market correction',
          techCrash: 'Tech crash',
          cryptoDips: 'Crypto dips',
          goldShines: 'Gold shines',
        },
        portfolioValue: 'Portfolio Value',
        gameComplete: 'Game Complete!',
        finalValue: 'Final Portfolio Value',
        endEarly: 'End Early',
      },
      budget: {
        name: 'Budget Master',
        description: 'Master the 50/30/20 budgeting rule',
        level: 'Level',
        budget: 'Budget',
        remaining: 'Remaining',
        needs: 'Needs',
        wants: 'Wants',
        savings: 'Savings',
        target: 'Target',
        categories: {
          rent: 'Rent/EMI',
          groceries: 'Groceries',
          utilities: 'Utilities',
          netflix: 'Netflix',
          dining: 'Dining Out',
          shopping: 'Shopping',
          emergency: 'Emergency Fund',
          investments: 'Investments',
        },
        perfectBudget: 'Perfect Budget!',
        allLevelsComplete: 'All levels completed!',
        checkBudget: 'Check Budget',
        notBalanced: 'Budget not balanced!',
      },
      stockmarket: {
        name: 'स्टॉक मार्केट प्रो',
        description: 'कैंडलस्टिक चार्ट के साथ रीयल-टाइम ट्रेडिंग',
        tutorial: {
          title: 'स्टॉक मार्केट सिमुलेटर',
          goal: '3 मिनट में अपना लाभ अधिकतम करें',
          start: '₹10,000 नकद',
          candlesticks: 'हरा = ऊपर, लाल = नीचे',
          indicators: 'MA20 (नीला), MA50 (नारंगी)',
          strategy: 'कम खरीदें, अधिक बेचें!',
        },
        time: 'समय',
        balance: 'शेष',
        holdings: 'होल्डिंग्स',
        pnl: 'लाभ/हानि',
        buy: 'खरीदें',
        sell: 'बेचें',
        quantity: 'मात्रा',
        currentPrice: 'वर्तमान मूल्य',
        news: 'समाचार',
        tradeHistory: 'हाल के ट्रेड',
        startTrading: 'ट्रेडिंग शुरू करें',
        pause: 'रोकें',
        resume: 'फिर से शुरू',
        exit: 'बाहर निकलें',
      },
      trivia: {
        name: 'Financial Trivia',
        description: 'Test your financial knowledge',
        question: 'Question',
        of: 'of',
        correct: 'Correct!',
        wrong: 'Wrong!',
        quizComplete: 'Quiz Complete!',
        finalScore: 'Final Score',
        streakBonus: 'Streak Bonus',
        questions: {
          q1: {
            q: 'What is the 50/30/20 rule?',
            options: ['Budgeting rule', 'Investment strategy', 'Tax rule'],
          },
          q2: {
            q: 'What does SIP stand for?',
            options: ['Systematic Investment Plan', 'Simple Interest Plan', 'Savings Insurance Plan'],
          },
          q3: {
            q: 'Which is considered the safest investment?',
            options: ['Stocks', 'Fixed Deposit', 'Crypto'],
          },
          q4: {
            q: 'What is compound interest?',
            options: ['Interest on principal only', 'Interest on interest', 'Simple interest'],
          },
          q5: {
            q: 'What is NAV in mutual funds?',
            options: ['Net Asset Value', 'New Asset Value', 'Nominal Asset Value'],
          },
        },
      },
    },

    // Power-ups
    powerups: {
      title: 'Power-Up Shop',
      doubleCoins: {
        name: '2x Coins',
        description: 'Double your coin rewards for 5 minutes',
      },
      timeFreeze: {
        name: 'Time Freeze',
        description: 'Freeze the timer for 15 seconds',
      },
      hint: {
        name: 'Hint',
        description: 'Reveal unmatched cards briefly',
      },
      shield: {
        name: 'Shield',
        description: 'Protect against penalties',
      },
      active: 'Active',
      duration: 'duration',
      uses: 'uses',
      buyFor: 'Buy for',
      notEnoughCoins: 'Not enough coins!',
    },

    // Achievements
    achievements: {
      title: 'Achievements',
      unlocked: 'Unlocked',
      locked: 'Locked',
      reward: 'Reward',
      firstWin: {
        name: 'First Win',
        description: 'Win your first game',
      },
      lucky: {
        name: 'Lucky Spin',
        description: 'Win jackpot in Lucky Spin',
      },
      memoryMaster: {
        name: 'Memory Master',
        description: 'Complete Memory Match with >30s left',
      },
      investor: {
        name: 'Smart Investor',
        description: 'Make 1000+ profit in Investment Tycoon',
      },
      budgetPro: {
        name: 'Budget Pro',
        description: 'Complete all Budget Master levels',
      },
      triviaWhiz: {
        name: 'Trivia Whiz',
        description: 'Score 150+ in Financial Trivia',
      },
      streak5: {
        name: 'On Fire!',
        description: '5 correct answers in a row in Trivia',
      },
      rich: {
        name: 'Getting Rich',
        description: 'Earn 5000+ total coins',
      },
    },

    // Stats
    stats: {
      title: 'Statistics',
      totalCoins: 'Total Coins Earned',
      totalGems: 'Total Gems Earned',
      gamesPlayed: 'Games Played',
      achievementsUnlocked: 'Achievements Unlocked',
      recentGames: 'Recent Games',
      noGames: 'No games played yet',
      winRate: 'Win Rate',
      favoriteGame: 'Favorite Game',
      totalPlayTime: 'Total Play Time',
    },

    // Background presets
    presets: {
      cyberpunk: 'Cyberpunk',
      midnight: 'Midnight',
      golden: 'Golden',
    },
  },

  // Hindi translations
  hi: {
    common: {
      back: 'वापस',
      close: 'बंद करें',
      play: 'खेलें',
      playAgain: 'फिर से खेलें',
      next: 'अगला',
      previous: 'पिछला',
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      yes: 'हाँ',
      no: 'नहीं',
      ok: 'ठीक है',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      info: 'जानकारी',
      coins: 'सिक्के',
      gems: 'रत्न',
      xp: 'अनुभव',
      level: 'स्तर',
      score: 'स्कोर',
      time: 'समय',
      moves: 'चालें',
      attempts: 'प्रयास',
      wins: 'जीत',
      losses: 'हार',
      streak: 'लगातार जीत',
      multiplier: 'गुणक',
      bonus: 'बोनस',
      reward: 'पुरस्कार',
      claim: 'प्राप्त करें',
      shop: 'दुकान',
      stats: 'आंकड़े',
      achievements: 'उपलब्धियां',
      settings: 'सेटिंग्स',
      help: 'मदद',
      sound: 'ध्वनि',
      music: 'संगीत',
      language: 'भाषा',
      difficulty: 'कठिनाई',
      easy: 'आसान',
      medium: 'मध्यम',
      hard: 'कठिन',
      reset: 'रीसेट',
      pause: 'रोकें',
      resume: 'फिर से शुरू',
      quit: 'छोड़ें',
      start: 'शुरू',
      finish: 'समाप्त',
      continue: 'जारी रखें',
      skip: 'छोड़ें',
      hint: 'संकेत',
      hints: 'संकेत',
      buy: 'खरीदें',
      sell: 'बेचें',
      price: 'कीमत',
      total: 'कुल',
      profit: 'लाभ',
      loss: 'हानि',
      balance: 'शेष',
      portfolio: 'पोर्टफोलियो',
      cash: 'नकद',
    },

    games: {
      title: 'वित्तीय आर्केड',
      subtitle: 'खेलें, पुरस्कार जीतें, वित्त पर महारत हासिल करें!',
      selectGame: 'एक खेल चुनें',
      gameCategories: {
        luck: 'भाग्य',
        skill: 'कौशल',
        edu: 'शिक्षा',
        sim: 'सिमुलेशन',
      },
    },

    gamesList: {
      spin: {
        name: 'भाग्यशाली स्पिन',
        description: 'सिक्के और रत्न जीतने के लिए घुमाएं',
        spinsLeft: 'बचे स्पिन',
        spin: 'घुमाएं',
        spinning: 'घूम रहा है...',
        jackpot: 'जैकपॉट!',
        youWon: 'आपने जीता',
        tryAgain: 'फिर से कोशिश करें',
        prizes: {
          coins50: '50 सिक्के',
          coins75: '75 सिक्के',
          coins200: '200 सिक्के',
          xp100: '100 अनुभव',
          gem1: '1 रत्न',
          jackpot: 'जैकपॉट!',
          doubleXP: '2x अनुभव',
        },
      },
      memory: {
        name: 'मेमोरी मैच',
        description: 'पुरस्कार जीतने के लिए प्रतीकों को मिलाएं',
        timeLeft: 'बचा समय',
        moves: 'चालें',
        matched: 'मिलाए गए',
        excellent: 'शानदार याददाश्त!',
        timeBonus: 'समय बोनस',
        moveBonus: 'चाल बोनस',
        frozen: 'रुका हुआ',
      },
      number: {
        name: 'नंबर अनुमान',
        description: 'गुप्त संख्या का अनुमान लगाएं',
        guess: 'अनुमान',
        enterNumber: '1-100 दर्ज करें',
        tooLow: '📈 बहुत कम!',
        tooHigh: '📉 बहुत अधिक!',
        correct: '🎉 सही! आप जीते!',
        gameOver: 'खेल खत्म!',
        theNumberWas: 'संख्या थी',
        tries: 'प्रयास',
      },
      investment: {
        name: 'निवेश टाइकून',
        description: 'स्मार्ट निवेश के माध्यम से धन बनाएं',
        day: 'दिन',
        of: 'में से',
        news: 'समाचार',
        marketOpens: 'बाजार खुला... निवेश शुरू करें!',
        assets: {
          stocks: 'टेक स्टॉक्स',
          crypto: 'क्रिप्टो',
          gold: 'सोना',
        },
        events: {
          stable: 'बाजार स्थिर',
          techBoom: 'टेक बूम!',
          cryptoSurge: 'क्रिप्टो उछाल',
          goldRises: 'सोना बढ़ा',
          correction: 'बाजार सुधार',
          techCrash: 'टेक क्रैश',
          cryptoDips: 'क्रिप्टो गिरा',
          goldShines: 'सोना चमका',
        },
        portfolioValue: 'पोर्टफोलियो मूल्य',
        gameComplete: 'खेल पूरा!',
        finalValue: 'अंतिम पोर्टफोलियो मूल्य',
        endEarly: 'जल्दी समाप्त करें',
      },
      budget: {
        name: 'बजट मास्टर',
        description: '50/30/20 बजटिंग नियम सीखें',
        level: 'स्तर',
        budget: 'बजट',
        remaining: 'बचा हुआ',
        needs: 'जरूरतें',
        wants: 'इच्छाएं',
        savings: 'बचत',
        target: 'लक्ष्य',
        categories: {
          rent: 'किराया/ईएमआई',
          groceries: 'किराने का सामान',
          utilities: 'उपयोगिताएं',
          netflix: 'नेटफ्लिक्स',
          dining: 'बाहर खाना',
          shopping: 'खरीदारी',
          emergency: 'आपातकालीन निधि',
          investments: 'निवेश',
        },
        perfectBudget: 'उत्तम बजट!',
        allLevelsComplete: 'सभी स्तर पूरे!',
        checkBudget: 'बजट जांचें',
        notBalanced: 'बजट संतुलित नहीं है!',
      },
      trivia: {
        name: 'वित्तीय ट्रिविया',
        description: 'अपने वित्तीय ज्ञान को परखें',
        question: 'प्रश्न',
        of: 'में से',
        correct: 'सही!',
        wrong: 'गलत!',
        quizComplete: 'क्विज पूरा!',
        finalScore: 'अंतिम स्कोर',
        streakBonus: 'लगातार बोनस',
        questions: {
          q1: {
            q: '50/30/20 नियम क्या है?',
            options: ['बजटिंग नियम', 'निवेश रणनीति', 'कर नियम'],
          },
          q2: {
            q: 'SIP का क्या अर्थ है?',
            options: ['सिस्टमैटिक इनवेस्टमेंट प्लान', 'सिंपल इंटरेस्ट प्लान', 'सेविंग्स इंश्योरेंस प्लान'],
          },
          q3: {
            q: 'सबसे सुरक्षित निवेश कौन सा है?',
            options: ['शेयर', 'फिक्स्ड डिपॉजिट', 'क्रिप्टो'],
          },
          q4: {
            q: 'चक्रवृद्धि ब्याज क्या है?',
            options: ['केवल मूलधन पर ब्याज', 'ब्याज पर ब्याज', 'साधारण ब्याज'],
          },
          q5: {
            q: 'म्यूचुअल फंड में NAV क्या है?',
            options: ['नेट एसेट वैल्यू', 'न्यू एसेट वैल्यू', 'नॉमिनल एसेट वैल्यू'],
          },
        },
      },
    },

    powerups: {
      title: 'पावर-अप दुकान',
      doubleCoins: {
        name: '2x सिक्के',
        description: '5 मिनट के लिए सिक्के दोगुने करें',
      },
      timeFreeze: {
        name: 'समय रोकें',
        description: '15 सेकंड के लिए टाइमर रोकें',
      },
      hint: {
        name: 'संकेत',
        description: 'बिना मिले कार्ड संक्षिप्त रूप से दिखाएं',
      },
      shield: {
        name: 'ढाल',
        description: 'जुर्मान से बचाएं',
      },
      active: 'सक्रिय',
      duration: 'अवधि',
      uses: 'उपयोग',
      buyFor: 'खरीदें',
      notEnoughCoins: 'पर्याप्त सिक्के नहीं!',
    },

    achievements: {
      title: 'उपलब्धियां',
      unlocked: 'अनलॉक्ड',
      locked: 'लॉक्ड',
      reward: 'पुरस्कार',
      firstWin: {
        name: 'पहली जीत',
        description: 'अपना पहला खेल जीतें',
      },
      lucky: {
        name: 'भाग्यशाली स्पिन',
        description: 'भाग्यशाली स्पिन में जैकपॉट जीतें',
      },
      memoryMaster: {
        name: 'मेमोरी मास्टर',
        description: '30 सेकंड से अधिक बचे समय के साथ मेमोरी मैच पूरा करें',
      },
      investor: {
        name: 'स्मार्ट इनवेस्टर',
        description: 'निवेश टाइकून में 1000+ लाभ कमाएं',
      },
      budgetPro: {
        name: 'बजट प्रो',
        description: 'सभी बजट मास्टर स्तर पूरे करें',
      },
      triviaWhiz: {
        name: 'ट्रिविया wiz',
        description: 'वित्तीय ट्रिविया में 150+ स्कोर करें',
      },
      streak5: {
        name: 'आग पर!',
        description: 'ट्रिविया में 5 सही उत्तर लगातार',
      },
      rich: {
        name: 'अमीर हो रहे',
        description: '5000+ कुल सिक्के कमाएं',
      },
    },

    stats: {
      title: 'आंकड़े',
      totalCoins: 'कुल कमाए गए सिक्के',
      totalGems: 'कुल कमाए गए रत्न',
      gamesPlayed: 'खेले गए खेल',
      achievementsUnlocked: 'अनलॉक की गई उपलब्धियां',
      recentGames: 'हाल के खेल',
      noGames: 'अभी तक कोई खेल नहीं खेला',
      winRate: 'जीत दर',
      favoriteGame: 'पसंदीदा खेल',
      totalPlayTime: 'कुल खेल समय',
    },

    presets: {
      cyberpunk: 'साइबरपंक',
      midnight: 'मध्यरात्रि',
      golden: 'सुनहरा',
    },
  },
};

// Create context
const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('dhyangyan_language');
    return saved || 'en';
  });

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('dhyangyan_language', lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    // Fallback to English
    if (value === undefined && language !== 'en') {
      value = translations['en'];
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }
    }

    // If still undefined, return the key
    if (value === undefined) {
      return key;
    }

    // Replace params
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value;
  }, [language]);

  const currentLanguage = LANGUAGES[language] || LANGUAGES['en'];

  return (
    <I18nContext.Provider value={{
      t,
      language,
      changeLanguage,
      currentLanguage,
      languages: LANGUAGES
    }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook for using translations
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
};

// HOC for class components
export const withTranslation = (Component) => {
  return (props) => {
    const translationProps = useTranslation();
    return <Component {...props} {...translationProps} />;
  };
};

export default I18nContext;
