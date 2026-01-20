import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

/**
 * Beautiful Progress Bar Component
 * Displays progress with animated fill and milestones
 */
const ProgressBar = ({ 
  progress = 0, 
  label, 
  showPercentage = true,
  color = "blue",
  milestones = [],
  className = "" 
}) => {
  const colors = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500",
  };

  const gradient = colors[color] || colors.blue;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-600">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="relative"
                style={{ left: `${milestone.position}%` }}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    progress >= milestone.position ? 'bg-white' : 'bg-gray-400'
                  }`}
                  animate={{
                    scale: progress >= milestone.position ? [1, 1.5, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                {progress >= milestone.position && (
                  <motion.div
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaCheckCircle className="text-green-500 text-sm" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
// Style improvement
