import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

/**
 * Beautiful Stats Card Component
 * Displays statistics with animated numbers and trend indicators
 */
const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  gradient = "from-blue-500 to-purple-500",
  className = "" 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <FaArrowUp className="text-green-500" />;
    if (trend === 'down') return <FaArrowDown className="text-red-500" />;
    return <FaMinus className="text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon}
        </motion.div>
        
        {trend && (
          <motion.div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm ${getTrendColor()}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {getTrendIcon()}
            <span className="text-sm font-semibold">{trendValue}</span>
          </motion.div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          {title}
        </h3>
        <motion.p
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {value}
        </motion.p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
