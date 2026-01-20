import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';

/**
 * Beautiful Theme Toggle Component
 * Allows users to switch between light and dark themes
 */
const ThemeToggle = ({ className = "" }) => {
  const [theme, setTheme] = useState('light');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('festies-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('festies-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isAnimating ? { rotate: 360 } : {}}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <FaSun className="text-white text-xl" />
        ) : (
          <FaMoon className="text-white text-xl" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
// Style improvement
