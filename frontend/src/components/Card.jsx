import { motion } from 'framer-motion';

/**
 * Beautiful Card Component
 * Reusable card with hover effects and animations
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  hover = true,
  gradient = false,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <motion.div
      className={`
        bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 
        backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 
        shadow-lg transition-all duration-300
        ${hover ? 'hover:shadow-xl hover:scale-[1.02]' : ''}
        ${gradient ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -5 } : {}}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className={`text-xl font-bold ${gradient ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-sm mt-1 ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className={gradient ? 'text-white' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className={`mt-4 pt-4 border-t ${gradient ? 'border-white/20' : 'border-gray-200'}`}>
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;
