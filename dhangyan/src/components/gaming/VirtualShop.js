import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Coins, Crown, Zap, BookOpen, 
  Sparkles, Check, Lock, Star, Gem, X, Gift
} from 'lucide-react';
import { AnimatedButton } from '../ui';
import confetti from 'canvas-confetti';

const shopCategories = [
  { id: 'boosters', name: 'Boosters', icon: Zap },
  { id: 'cosmetics', name: 'Cosmetics', icon: Sparkles },
  { id: 'courses', name: 'Courses', icon: BookOpen },
  { id: 'gems', name: 'Gems', icon: Gem },
];

const shopItems = [
  // Boosters
  {
    id: 'xp_2x',
    name: '2x XP Booster',
    description: 'Double XP for 1 hour',
    price: { coins: 500 },
    category: 'boosters',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    duration: '1 hour',
  },
  {
    id: 'coin_2x',
    name: '2x Coins Booster',
    description: 'Double coins from quests',
    price: { coins: 300 },
    category: 'boosters',
    icon: Coins,
    color: 'from-yellow-500 to-orange-500',
    duration: '2 hours',
  },
  {
    id: 'streak_shield',
    name: 'Streak Shield',
    description: 'Protect your streak for 1 day',
    price: { gems: 2 },
    category: 'boosters',
    icon: Crown,
    color: 'from-blue-500 to-cyan-500',
    duration: '24 hours',
  },
  
  // Cosmetics
  {
    id: 'avatar_frame_gold',
    name: 'Golden Frame',
    description: 'Exclusive gold avatar border',
    price: { gems: 10 },
    category: 'cosmetics',
    icon: Crown,
    color: 'from-yellow-400 to-yellow-600',
    rarity: 'legendary',
  },
  {
    id: 'theme_dark',
    name: 'Dark Knight Theme',
    description: 'Premium dark theme',
    price: { coins: 1000 },
    category: 'cosmetics',
    icon: Sparkles,
    color: 'from-gray-700 to-gray-900',
    rarity: 'epic',
  },
  {
    id: 'badge_collector',
    name: 'Collector Badge',
    description: 'Show off your achievements',
    price: { gems: 5 },
    category: 'cosmetics',
    icon: Star,
    color: 'from-pink-500 to-rose-500',
    rarity: 'rare',
  },
  
  // Courses
  {
    id: 'course_advanced',
    name: 'Advanced Investing',
    description: 'Master stock market strategies',
    price: { coins: 2000 },
    category: 'courses',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    level: 'Advanced',
  },
  {
    id: 'course_tax',
    name: 'Tax Planning Pro',
    description: 'Learn tax saving strategies',
    price: { gems: 15 },
    category: 'courses',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-500',
    level: 'Expert',
  },
  {
    id: 'course_crypto',
    name: 'Crypto Basics',
    description: 'Introduction to cryptocurrency',
    price: { coins: 1500 },
    category: 'courses',
    icon: BookOpen,
    color: 'from-orange-500 to-red-500',
    level: 'Beginner',
  },
  
  // Gems
  {
    id: 'gems_10',
    name: '10 Gems',
    description: 'Premium currency pack',
    price: { coins: 5000 },
    category: 'gems',
    icon: Gem,
    color: 'from-blue-400 to-purple-500',
    amount: 10,
  },
  {
    id: 'gems_50',
    name: '50 Gems',
    description: 'Best value gem pack',
    price: { coins: 20000 },
    category: 'gems',
    icon: Gem,
    color: 'from-purple-400 to-pink-500',
    popular: true,
    amount: 50,
  },
  {
    id: 'gems_100',
    name: '100 Gems',
    description: 'Ultimate gem pack',
    price: { coins: 35000 },
    category: 'gems',
    icon: Gem,
    color: 'from-yellow-400 to-orange-500',
    amount: 100,
  },
];

const rarityStyles = {
  legendary: 'border-yellow-400 shadow-yellow-400/50',
  epic: 'border-purple-400 shadow-purple-400/50',
  rare: 'border-blue-400 shadow-blue-400/50',
  common: 'border-gray-400',
};

const ShopItemCard = ({ item, userBalance, onPurchase, isOwned }) => {
  const [purchasing, setPurchasing] = useState(false);
  const Icon = item.icon;
  
  const canAfford = 
    (!item.price.coins || userBalance.coins >= item.price.coins) &&
    (!item.price.gems || userBalance.gems >= item.price.gems);

  const handlePurchase = () => {
    if (!canAfford || isOwned) return;
    
    setPurchasing(true);
    setTimeout(() => {
      onPurchase(item);
      setPurchasing(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500']
      });
    }, 500);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className={`
        relative p-5 rounded-2xl bg-white/5 border-2 transition-all
        ${item.rarity ? rarityStyles[item.rarity] : 'border-white/10'}
        ${isOwned ? 'opacity-75' : 'hover:bg-white/10'}
      `}
    >
      {/* Popular Badge */}
      {item.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold">
          POPULAR
        </div>
      )}

      {/* Rarity Badge */}
      {item.rarity && (
        <div className={`absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-1 rounded bg-${item.rarity === 'legendary' ? 'yellow' : item.rarity === 'epic' ? 'purple' : 'blue'}-500/20 text-${item.rarity === 'legendary' ? 'yellow' : item.rarity === 'epic' ? 'purple' : 'blue'}-400`}>
          {item.rarity}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} flex-shrink-0`}>
          <Icon size={28} className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
          <p className="text-sm text-gray-400 mb-3">{item.description}</p>
          
          {item.duration && (
            <p className="text-xs text-purple-400 mb-2">⏱️ Duration: {item.duration}</p>
          )}
          {item.level && (
            <p className="text-xs text-blue-400 mb-2">📚 Level: {item.level}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            {item.price.coins && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Coins size={16} />
                <span className="font-bold">{item.price.coins.toLocaleString()}</span>
              </div>
            )}
            {item.price.gems && (
              <div className="flex items-center gap-1 text-blue-400">
                <Gem size={16} />
                <span className="font-bold">{item.price.gems}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Button */}
      <motion.button
        whileHover={{ scale: canAfford && !isOwned ? 1.02 : 1 }}
        whileTap={{ scale: canAfford && !isOwned ? 0.98 : 1 }}
        onClick={handlePurchase}
        disabled={!canAfford || isOwned || purchasing}
        className={`
          w-full mt-4 py-2 rounded-xl font-medium transition-all
          ${isOwned 
            ? 'bg-green-500/20 text-green-400 cursor-default'
            : canAfford
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {purchasing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Processing...
          </span>
        ) : isOwned ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={18} /> Owned
          </span>
        ) : !canAfford ? (
          <span className="flex items-center justify-center gap-2">
            <Lock size={16} /> Insufficient Funds
          </span>
        ) : (
          'Purchase'
        )}
      </motion.button>
    </motion.div>
  );
};

const VirtualShop = ({ user, onClose, onPurchase }) => {
  const [activeCategory, setActiveCategory] = useState('boosters');
  const [purchasedItems, setPurchasedItems] = useState(user?.purchasedItems || []);
  const [showSuccess, setShowSuccess] = useState(null);

  const filteredItems = shopItems.filter(item => item.category === activeCategory);
  
  const userBalance = {
    coins: user?.coins || 5000,
    gems: user?.gems || 10,
  };

  const handlePurchase = (item) => {
    setPurchasedItems(prev => [...prev, item.id]);
    onPurchase?.(item);
    setShowSuccess(item);
    setTimeout(() => setShowSuccess(null), 3000);
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
        className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-6 border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <ShoppingBag size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Virtual Shop</h2>
              <p className="text-gray-400 text-sm">Spend your hard-earned coins & gems!</p>
            </div>
          </div>
          
          {/* Balance */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <Coins size={18} className="text-yellow-400" />
              <span className="font-bold">{userBalance.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <Gem size={18} className="text-blue-400" />
              <span className="font-bold">{userBalance.gems}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {shopCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-5 py-2 rounded-full transition-all
                  ${activeCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }
                `}
              >
                <Icon size={18} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  userBalance={userBalance}
                  onPurchase={handlePurchase}
                  isOwned={purchasedItems.includes(item.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <Gift size={20} />
              <span>Purchased: {showSuccess.name}!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default VirtualShop;
