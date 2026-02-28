import React from 'react';
import { motion } from 'framer-motion';
import './Loading.css';

/**
 * Loading Component with animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Loading style (spinner, dots, pulse)
 * @param {string} props.size - Size (sm, md, lg)
 * @param {string} props.text - Loading text
 */
const Loading = ({ variant = 'spinner', size = 'md', text }) => {
    const sizeClass = `loading-${size}`;

    const renderSpinner = () => (
        <motion.div
            className={`loading-spinner ${sizeClass}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
            <svg viewBox="0 0 50 50">
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="31.4 31.4"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>
        </motion.div>
    );

    const renderDots = () => (
        <div className={`loading-dots ${sizeClass}`}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="loading-dot"
                    animate={{ y: [-10, 0, -10] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );

    const renderPulse = () => (
        <motion.div
            className={`loading-pulse ${sizeClass}`}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    );

    const variants = {
        spinner: renderSpinner,
        dots: renderDots,
        pulse: renderPulse,
    };

    return (
        <div className="loading-container">
            {variants[variant]()}
            {text && (
                <motion.p
                    className="loading-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};

export default Loading;
