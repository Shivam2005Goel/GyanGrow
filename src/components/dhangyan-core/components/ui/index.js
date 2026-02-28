import React from 'react';
import { motion } from 'framer-motion';

// Enhanced Glass Card with better animations
export const GlassCard = ({ 
  children, 
  className = '', 
  hoverScale = 1.02,
  glowColor = 'rgba(147, 51, 234, 0.3)'
}) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-xl
        ${className}
      `}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: `0 20px 40px ${glowColor}`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// Animated Button with multiple variants
export const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  onClick,
  icon: Icon,
  loading = false,
  disabled = false
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
    secondary: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600',
    outline: 'bg-transparent border-2 border-white/30 text-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-full font-semibold
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <>
          {Icon && <Icon size={20} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

// Badge Component
export const Badge = ({ children, color = 'purple', className = '' }) => {
  const colors = {
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-medium
      border ${colors[color]} ${className}
    `}>
      {children}
    </span>
  );
};

// Skeleton Loader
export const Skeleton = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <motion.div
      className={`bg-white/10 rounded ${className}`}
      style={{ width, height }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
};

// Progress Bar
export const ProgressBar = ({ progress = 0, color = 'purple', className = '' }) => {
  const colors = {
    purple: 'from-purple-500 to-blue-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-yellow-500 to-orange-500',
    gray: 'from-gray-500 to-gray-400',
  };

  return (
    <div className={`w-full h-2 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
};

// Section Title with animation
export const SectionTitle = ({ 
  title, 
  subtitle, 
  align = 'center',
  className = '' 
}) => {
  const alignClass = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  };

  return (
    <motion.div 
      className={`mb-8 ${alignClass[align]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-gray-300 text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
};

// Toast Notification Component
export const Toast = ({ message, type = 'info', onClose }) => {
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg`}
    >
      {message}
    </motion.div>
  );
};

// Tooltip Component
export const Tooltip = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};

// Stat Card
export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = 'purple' 
}) => {
  const colors = {
    purple: 'from-purple-500/20 to-blue-500/20',
    green: 'from-green-500/20 to-emerald-500/20',
    blue: 'from-blue-500/20 to-cyan-500/20',
    yellow: 'from-yellow-500/20 to-orange-500/20',
  };

  return (
    <GlassCard className={`bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-white/10 rounded-lg">
            <Icon size={24} className="text-white" />
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default {
  GlassCard,
  AnimatedButton,
  Badge,
  Skeleton,
  ProgressBar,
  SectionTitle,
  Toast,
  Tooltip,
  StatCard,
};

// Language Components
export { default as LanguageSelector, LanguageToggle, LanguageFlag } from './LanguageSelector';
// Heatmap
export { default as ContributionHeatmap, MiniHeatmap } from './ContributionHeatmap';
// Text Animations
export { default as Shuffle } from '../Shuffle';