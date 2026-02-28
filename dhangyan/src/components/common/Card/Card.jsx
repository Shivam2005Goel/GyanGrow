import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

/**
 * Modern Card Component with glassmorphism effect
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Card style (glass, solid, outline)
 * @param {boolean} props.interactive - Enable hover effects
 * @param {boolean} props.glow - Add glow effect
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 * @param {function} props.onClick - Click handler
 */
const Card = ({
    variant = 'glass',
    interactive = false,
    glow = false,
    className = '',
    children,
    onClick,
    ...rest
}) => {
    const baseClass = 'card';
    const variantClass = `card-${variant}`;
    const interactiveClass = interactive ? 'card-interactive' : '';
    const glowClass = glow ? 'glow' : '';

    return (
        <motion.div
            className={`${baseClass} ${variantClass} ${interactiveClass} ${glowClass} ${className}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={interactive ? { y: -4, scale: 1.02 } : {}}
            transition={{ duration: 0.3 }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default Card;
