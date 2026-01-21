import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaKeyboard } from 'react-icons/fa';

/**
 * SearchBar Component
 * Advanced search bar with suggestions, history, and keyboard shortcuts
 */
const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  suggestions = [],
  showHistory = true,
  historyLimit = 5,
  className = '',
  ...props
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('search_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  const filteredHistory = searchHistory
    .filter((item) =>
      item.toLowerCase().includes(query.toLowerCase()) && item !== query
    )
    .slice(0, historyLimit);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    // Add to history
    const newHistory = [
      searchQuery,
      ...searchHistory.filter((item) => item !== searchQuery),
    ].slice(0, historyLimit);

    setSearchHistory(newHistory);
    try {
      localStorage.setItem('search_history', JSON.stringify(newHistory));
    } catch {
      // Storage unavailable
    }

    onSearch?.(searchQuery);
    setQuery('');
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
        handleSearch(filteredSuggestions[selectedIndex]);
      } else if (selectedIndex >= 0 && filteredHistory.length > 0) {
        const historyIndex = selectedIndex - filteredSuggestions.length;
        handleSearch(filteredHistory[historyIndex]);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = filteredSuggestions.length + filteredHistory.length - 1;
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('search_history');
    } catch {
      // Storage unavailable
    }
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-xs text-gray-400">
          <FaKeyboard className="w-3 h-3" />
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">⌘K</kbd>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && (filteredSuggestions.length > 0 || (filteredHistory.length > 0 && showHistory)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
          >
            {filteredSuggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Suggestions
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedIndex === index
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                        : 'text-gray-900 dark:text-white'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <FaSearch className="inline-block w-4 h-4 mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {filteredHistory.length > 0 && showHistory && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Recent Searches
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-purple-500 hover:text-purple-600"
                  >
                    Clear
                  </button>
                </div>
                {filteredHistory.map((item, index) => {
                  const itemIndex = filteredSuggestions.length + index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        selectedIndex === itemIndex
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                          : 'text-gray-900 dark:text-white'
                      }`}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                    >
                      <FaSearch className="inline-block w-4 h-4 mr-2 text-gray-400" />
                      {item}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
// Style improvement
