import { motion } from 'framer-motion';

/**
 * Beautiful Spinner Component
 * Loading spinner with customizable size and color
 */
const Spinner = ({
  size = 'md',
  color = 'blue',
  className = "",
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500',
  };

  return (
    <motion.div
      className={`
        ${sizes[size]} ${colors[color]}
        border-4 border-t-transparent rounded-full
        ${className}
      `}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

export default Spinner;
