import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

/**
 * Modern Button Component with animations and variants
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant (primary, secondary, glass, outline, ghost)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.iconPosition - Icon position (left, right)
 * @param {React.ReactNode} props.children - Button content
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    children,
    onClick,
    className = '',
    ...rest
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const isDisabled = disabled || loading;

    return (
        <motion.button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            onClick={onClick}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            transition={{ duration: 0.2 }}
            {...rest}
        >
            {loading && (
                <motion.div
                    className="btn-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="12 8" />
                    </svg>
                </motion.div>
            )}

            {!loading && icon && iconPosition === 'left' && (
                <span className="btn-icon btn-icon-left">{icon}</span>
            )}

            <span className="btn-content">{children}</span>

            {!loading && icon && iconPosition === 'right' && (
                <span className="btn-icon btn-icon-right">{icon}</span>
            )}
        </motion.button>
    );
};

export default Button;
