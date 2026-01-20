import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

/**
 * Beautiful Alert Component
 * Displays alert messages with different variants
 */
const Alert = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = "",
  icon,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-500',
      icon: <FaCheckCircle />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      icon: <FaTimesCircle />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      icon: <FaExclamationTriangle />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-500',
      icon: <FaInfoCircle />,
    },
  };

  const variant = variants[type] || variants.info;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`
            ${variant.bg} ${variant.border} border-2 rounded-xl p-4 shadow-lg
            ${className}
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`text-xl ${variant.iconColor} flex-shrink-0 mt-0.5`}>
              {icon || variant.icon}
            </div>
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`font-semibold mb-1 ${variant.text}`}>
                  {title}
                </h4>
              )}
              {message && (
                <p className={`text-sm ${variant.text}`}>
                  {message}
                </p>
              )}
              {action && (
                <div className="mt-3">
                  {action}
                </div>
              )}
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className={`flex-shrink-0 ${variant.text} hover:opacity-70 transition-opacity`}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
