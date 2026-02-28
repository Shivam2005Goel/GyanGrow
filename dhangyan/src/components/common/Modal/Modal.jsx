import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Modern Modal Component with animations
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal visibility state
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.size - Modal size (sm, md, lg, xl)
 * @param {boolean} props.showCloseButton - Show close button
 * @param {React.ReactNode} props.children - Modal content
 */
const Modal = ({
    isOpen = false,
    onClose,
    title,
    size = 'md',
    showCloseButton = true,
    children,
    className = '',
}) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="modal-container">
                        <motion.div
                            className={`modal modal-${size} ${className}`}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <div className="modal-header">
                                    {title && <h2 className="modal-title">{title}</h2>}
                                    {showCloseButton && (
                                        <motion.button
                                            className="modal-close"
                                            onClick={onClose}
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <X size={24} />
                                        </motion.button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="modal-content">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
