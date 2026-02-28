import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Crown, Sparkles, Zap, Flame, Droplets, Wind, 
  Star, Check, Lock, Gem
} from 'lucide-react';
import { AnimatedButton } from '../ui';

const characterTypes = [
  { 
    id: 'wizard', 
    name: 'Financial Wizard', 
    icon: Zap, 
    color: 'from-purple-500 to-indigo-600',
    description: 'Master of investments and wealth spells',
    specialAbility: '2x XP on Investment Courses',
    stats: { knowledge: 90, speed: 70, luck: 85 }
  },
  { 
    id: 'warrior', 
    name: 'Budget Warrior', 
    icon: Flame, 
    color: 'from-red-500 to-orange-600',
    description: 'Unstoppable in saving and budgeting battles',
    specialAbility: '2x Coins from Daily Challenges',
    stats: { knowledge: 75, speed: 85, luck: 70 }
  },
  { 
    id: 'healer', 
    name: 'Wealth Healer', 
    icon: Droplets, 
    color: 'from-cyan-500 to-blue-600',
    description: 'Expert in debt management and recovery',
    specialAbility: '50% Discount on courses',
    stats: { knowledge: 85, speed: 65, luck: 90 }
  },
  { 
    id: 'ranger', 
    name: 'Money Ranger', 
    icon: Wind, 
    color: 'from-green-500 to-emerald-600',
    description: 'Swift explorer of financial opportunities',
    specialAbility: 'Access to exclusive quests',
    stats: { knowledge: 80, speed: 95, luck: 75 }
  },
  { 
    id: 'sage', 
    name: 'Financial Sage', 
    icon: Star, 
    color: 'from-yellow-500 to-amber-600',
    description: 'Wise mentor with ancient financial wisdom',
    specialAbility: '3x Streak Bonus',
    stats: { knowledge: 95, speed: 60, luck: 80 }
  },
];

const CharacterCard = ({ character, isSelected, isLocked, onClick }) => {
  const Icon = character.icon;
  
  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.05, y: isLocked ? 0 : -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={!isLocked ? onClick : undefined}
      className={`
        relative p-6 rounded-2xl cursor-pointer overflow-hidden
        ${isSelected 
          ? 'bg-gradient-to-br ' + character.color + ' ring-4 ring-white/50' 
          : 'bg-white/10 hover:bg-white/20'
        }
        ${isLocked ? 'opacity-50 grayscale' : ''}
        border border-white/20 transition-all
      `}
    >
      {isSelected && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${character.color} opacity-50 blur-xl`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="relative z-10">
        <div className={`
          w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
          bg-gradient-to-br ${character.color}
          ${isSelected ? 'shadow-lg shadow-purple-500/50' : ''}
        `}>
          <Icon size={40} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-center mb-2">{character.name}</h3>
        <p className="text-sm text-gray-300 text-center mb-3">{character.description}</p>
        
        <div className="space-y-2">
          {Object.entries(character.stats).map(([stat, value]) => (
            <div key={stat} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 capitalize w-16">{stat}</span>
              <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-full rounded-full bg-gradient-to-r ${character.color}`}
                />
              </div>
              <span className="text-xs font-bold">{value}</span>
            </div>
          ))}
        </div>
        
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-white/20 rounded-lg"
          >
            <p className="text-xs text-yellow-300 flex items-center gap-1">
              <Sparkles size={12} />
              {character.specialAbility}
            </p>
          </motion.div>
        )}
        
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <Lock size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-400">Unlock at Level 10</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AvatarSystem = ({ user, onClose, onUpdate }) => {
  const [selectedChar, setSelectedChar] = useState(user?.character || 'wizard');
  const [activeTab, setActiveTab] = useState('characters');

  const currentChar = characterTypes.find(c => c.id === selectedChar);
  const userLevel = user?.level || 1;

  const handleSave = () => {
    onUpdate({ character: selectedChar });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Choose Your Avatar</h2>
              <p className="text-gray-400 text-sm">Select your financial warrior persona</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characterTypes.map((char, index) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CharacterCard
                  character={char}
                  isSelected={selectedChar === char.id}
                  isLocked={index > 2 && userLevel < (index - 2) * 10}
                  onClick={() => setSelectedChar(char.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/10">
          <AnimatedButton variant="outline" onClick={onClose}>
            Cancel
          </AnimatedButton>
          <AnimatedButton variant="primary" onClick={handleSave}>
            <Check size={18} /> Save Changes
          </AnimatedButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AvatarSystem;
