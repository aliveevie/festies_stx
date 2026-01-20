import { motion } from 'framer-motion';
import { FaCircle } from 'react-icons/fa';

/**
 * Beautiful Timeline Component
 * Vertical timeline with events
 */
const Timeline = ({
  items,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="relative pl-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-1">
              <div className="relative">
                <FaCircle className="text-blue-500 text-sm" />
                <motion.div
                  className="absolute inset-0 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Timeline content */}
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-lg">
              {item.date && (
                <p className="text-sm text-gray-500 mb-2">{item.date}</p>
              )}
              {item.title && (
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p className="text-gray-600">{item.description}</p>
              )}
              {item.content && <div className="mt-2">{item.content}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
