import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

/**
 * Beautiful Textarea Component
 * Textarea with validation states and animations
 */
const Textarea = forwardRef(({
  label,
  error,
  success,
  helperText,
  icon,
  rows = 4,
  fullWidth = false,
  className = "",
  ...props
}, ref) => {
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.textarea
          ref={ref}
          rows={rows}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 resize-y
            ${hasError 
              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
              : hasSuccess
              ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100'
              : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }
            ${icon ? 'pl-11' : ''}
            focus:outline-none
          `}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        
        {hasError && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-3 top-3 text-red-500"
          >
            <FaExclamationCircle />
          </motion.div>
        )}
        
        {hasSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-3 top-3 text-green-500"
          >
            <FaCheckCircle />
          </motion.div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
      
      {success && !error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-green-600"
        >
          {success}
        </motion.p>
      )}
      
      {helperText && !error && !success && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
// Style improvement
