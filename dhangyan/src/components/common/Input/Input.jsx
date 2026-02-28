import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

/**
 * Modern Input Component with animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, number, etc.)
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Disable input
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.className - Additional CSS classes
 */
const Input = ({
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    icon,
    className = '',
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <motion.label
                    className="input-label"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {label}
                </motion.label>
            )}

            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}

                <motion.input
                    type={inputType}
                    className={`input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    whileFocus={{ scale: 1.01 }}
                    {...rest}
                />

                {type === 'password' && (
                    <motion.button
                        type="button"
                        className="input-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.button>
                )}

                {isFocused && (
                    <motion.div
                        className="input-focus-border"
                        layoutId="input-focus"
                        transition={{ type: 'spring', damping: 30, stiffness: 500 }}
                    />
                )}
            </div>

            {error && (
                <motion.p
                    className="input-error-message"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
