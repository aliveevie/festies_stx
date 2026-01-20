import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

/**
 * Beautiful Tag Component
 * Tag with optional remove functionality
 */
const Tag = ({
  children,
  variant = 'default',
  size = 'md',
  onRemove,
  className = "",
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-2 font-semibold rounded-full border-2
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Remove tag"
        >
          <FaTimes className="text-xs" />
        </button>
      )}
    </motion.span>
  );
};

export default Tag;
