import { motion } from 'framer-motion';
import { FaInbox } from 'react-icons/fa';

/**
 * Beautiful EmptyState Component
 * Displays empty state with icon and message
 */
const EmptyState = ({
  icon = <FaInbox className="text-6xl text-gray-400" />,
  title = 'No items found',
  description,
  action,
  className = "",
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-4"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
