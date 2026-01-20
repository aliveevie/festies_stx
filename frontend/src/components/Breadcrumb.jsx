import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * Beautiful Breadcrumb Component
 * Navigation breadcrumb with icons
 */
const Breadcrumb = ({
  items,
  separator = <FaChevronRight className="text-gray-400 text-xs" />,
  className = "",
}) => {
  return (
    <nav className={`flex items-center space-x-2 ${className}`} aria-label="Breadcrumb">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex items-center"
      >
        <Link
          to="/"
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          <FaHome />
        </Link>
      </motion.div>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-gray-400">{separator}</span>
          {index === items.length - 1 ? (
            <span className="text-gray-800 font-semibold">{item.label}</span>
          ) : (
            <Link
              to={item.to}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
