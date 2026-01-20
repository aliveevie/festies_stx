import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Beautiful Tabs Component
 * Tabbed interface with smooth transitions
 */
const Tabs = ({ tabs, defaultTab = 0, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex gap-2 border-b-2 border-gray-200 mb-4 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              relative px-6 py-3 font-semibold text-gray-700 transition-colors
              whitespace-nowrap
              ${activeTab === index ? 'text-blue-600' : 'hover:text-gray-900'}
            `}
          >
            {tab.label}
            {activeTab === index && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {tabs[activeTab]?.content}
      </motion.div>
    </div>
  );
};

export default Tabs;
// Style improvement
