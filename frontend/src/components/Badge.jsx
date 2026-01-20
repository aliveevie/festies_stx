import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaExclamation, FaInfo } from 'react-icons/fa';

/**
 * Beautiful Badge Component
 * Displays status badges with icons and colors
 */
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  icon,
  className = "" 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const defaultIcons = {
    success: <FaCheck />,
    error: <FaTimes />,
    warning: <FaExclamation />,
    info: <FaInfo />,
  };

  return (
    <motion.span
      className={`inline-flex items-center gap-2 font-semibold rounded-full border-2 ${variants[variant]} ${sizes[size]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {icon || (defaultIcons[variant] && <span className="text-xs">{defaultIcons[variant]}</span>)}
      {children}
    </motion.span>
  );
};

export default Badge;
// Style improvement
