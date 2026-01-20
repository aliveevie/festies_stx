/**
 * Drawer component - Slide-out panel
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  children,
  title,
  position = 'right',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    top: 'top-0 w-full',
    bottom: 'bottom-0 w-full',
  };

  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            variants={slideVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              fixed ${positionClasses[position]} 
              ${position === 'left' || position === 'right' ? 'top-0 h-full' : 'h-96'} 
              ${sizeClasses[size]}
              bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 
              border border-purple-500/30 shadow-2xl z-50
              ${className}
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-purple-400" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto h-full p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
// Style improvement
