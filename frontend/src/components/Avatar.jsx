import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';

/**
 * Beautiful Avatar Component
 * User avatar with image or initials
 */
const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  status,
  className = "",
  onClick,
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  return (
    <div className={`relative inline-block ${className}`} onClick={onClick}>
      <motion.div
        className={`
          ${sizes[size]} ${shapes[shape]}
          bg-gradient-to-br from-blue-500 to-purple-500
          flex items-center justify-center text-white font-semibold
          overflow-hidden shadow-lg
          ${onClick ? 'cursor-pointer' : ''}
        `}
        whileHover={onClick ? { scale: 1.05 } : {}}
        whileTap={onClick ? { scale: 0.95 } : {}}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className={`w-full h-full object-cover ${shapes[shape]}`}
          />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <FaUser />
        )}
      </motion.div>
      {status && (
        <motion.div
          className={`
            absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]}
            border-2 border-white rounded-full
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        />
      )}
    </div>
  );
};

export default Avatar;
