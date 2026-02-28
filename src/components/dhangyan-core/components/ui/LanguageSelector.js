import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useTranslation, LANGUAGES } from '../../i18n';

const LanguageSelector = ({ variant = 'dropdown', className = '' }) => {
  const { language, changeLanguage, currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  // Compact button variant
  if (variant === 'button') {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all ${className}`}
      >
        <Globe size={16} />
        <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
      </button>
    );
  }

  // Full selector with dropdown
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.nativeName}</span>
        <Globe size={16} className="text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3">
                <p className="text-xs text-gray-400 px-3 py-2 uppercase tracking-wider">Select Language</p>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => handleSelect(code)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                        language === code 
                          ? 'bg-white/20 text-white' 
                          : 'hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{lang.flag}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium">{lang.nativeName}</p>
                          <p className="text-xs text-gray-500">{lang.name}</p>
                        </div>
                      </div>
                      {language === code && (
                        <Check size={16} className="text-green-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Inline language toggle for minimal UI
export const LanguageToggle = ({ className = '' }) => {
  const { language, changeLanguage } = useTranslation();
  
  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium hover:bg-white/20 transition-colors ${className}`}
    >
      {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
    </button>
  );
};

// Language flag display
export const LanguageFlag = ({ code, size = 'md', showName = false }) => {
  const lang = LANGUAGES[code] || LANGUAGES['en'];
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <span className={`inline-flex items-center gap-2 ${sizeClasses[size]}`}>
      <span>{lang.flag}</span>
      {showName && <span className="text-sm font-medium">{lang.nativeName}</span>}
    </span>
  );
};

export default LanguageSelector;
