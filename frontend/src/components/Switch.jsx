import { motion } from 'framer-motion';

/**
 * Beautiful Switch Component
 * Toggle switch with smooth animations
 */
const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = ""
}) => {
  const sizes = {
    sm: 'w-10 h-6',
    md: 'w-14 h-8',
    lg: 'w-18 h-10',
  };

  const thumbSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div
        className={`
          relative ${sizes[size]} rounded-full transition-colors duration-300
          ${checked
            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
            : 'bg-gray-300'
          }
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <motion.div
          className={`
            absolute top-1/2 ${thumbSizes[size]} bg-white rounded-full shadow-lg
          `}
          animate={{
            x: checked ? (size === 'sm' ? 16 : size === 'md' ? 24 : 32) : 4,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ transform: 'translateY(-50%)' }}
        />
      </div>
      {label && (
        <span className="text-gray-700 font-medium">{label}</span>
      )}
    </label>
  );
};

export default Switch;
// Style improvement
