import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

/**
 * Beautiful Input Component
 * Reusable input with validation states and animations
 */
const Input = forwardRef(({
  label,
  error,
  success,
  helperText,
  icon,
  iconPosition = 'left',
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
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
            ${hasError 
              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
              : hasSuccess
              ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100'
              : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }
            ${icon && iconPosition === 'left' ? 'pl-11' : ''}
            ${icon && iconPosition === 'right' ? 'pr-11' : ''}
            focus:outline-none
          `}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {hasError && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
          >
            <FaExclamationCircle />
          </motion.div>
        )}
        
        {hasSuccess && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
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

Input.displayName = 'Input';

export default Input;
