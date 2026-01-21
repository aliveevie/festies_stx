import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaKeyboard, FaChevronRight } from 'react-icons/fa';
import { useKeyboard } from '../hooks';

/**
 * CommandPalette Component
 * A command palette/search interface with keyboard shortcuts and commands
 */
const CommandPalette = ({
  isOpen,
  onClose,
  commands = [],
  placeholder = 'Type a command or search...',
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Default commands
  const defaultCommands = [
    { id: 'home', label: 'Go to Home', path: '/', icon: '🏠', category: 'Navigation' },
    { id: 'dashboard', label: 'Go to Dashboard', path: '/dashboard', icon: '📊', category: 'Navigation' },
    { id: 'marketplace', label: 'Go to Marketplace', path: '/marketplace', icon: '🛒', category: 'Navigation' },
    { id: 'collection', label: 'Go to Collection', path: '/collection', icon: '🎨', category: 'Navigation' },
    { id: 'create', label: 'Create Greeting', path: '/create', icon: '✨', category: 'Actions' },
    { id: 'settings', label: 'Settings', path: '/settings', icon: '⚙️', category: 'Settings' },
    { id: 'profile', label: 'Profile', path: '/profile', icon: '👤', category: 'Settings' },
    { id: 'help', label: 'Help Center', path: '/help', icon: '❓', category: 'Help' },
  ];

  const allCommands = [...defaultCommands, ...commands];

  // Keyboard shortcut: Cmd/Ctrl + K
  useKeyboard({
    onKeyDown: (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Triggered from parent
        }
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredCommands = allCommands.filter((command) =>
    command.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleCommandSelect(filteredCommands[selectedIndex]);
      }
    }
  };

  const handleCommandSelect = (command) => {
    if (command.path) {
      navigate(command.path);
    }
    if (command.action) {
      command.action();
    }
    onClose();
  };

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    const category = command.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(command);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700 ${className}`}
            {...props}
          >
            {/* Search Input */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <FaSearch className="text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="text-gray-400 w-4 h-4" />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p>No commands found</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category} className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      {category}
                    </div>
                    {commands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <motion.button
                          key={command.id}
                          onClick={() => handleCommandSelect(command)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center space-x-3">
                            {command.icon && <span className="text-xl">{command.icon}</span>}
                            <span className="font-medium">{command.label}</span>
                          </div>
                          {command.shortcut && (
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              {command.shortcut.split('+').map((key, i) => (
                                <kbd
                                  key={i}
                                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                          <FaChevronRight className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <FaKeyboard className="w-3 h-3" />
                  <span>Navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
              <span>{filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
// Style improvement
// Refactor improvement
