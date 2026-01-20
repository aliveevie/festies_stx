import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

/**
 * Beautiful Checkbox Component
 * Custom checkbox with animations
 */
const Checkbox = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <motion.div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            ${checked
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500'
              : 'border-gray-300 bg-white'
            }
            transition-all duration-300
          `}
          animate={{
            scale: checked ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaCheck className="text-white text-xs" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {label && (
        <span className="text-gray-700 font-medium">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
