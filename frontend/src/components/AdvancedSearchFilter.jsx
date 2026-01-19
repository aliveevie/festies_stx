import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaCalendarAlt, 
  FaUser, 
  FaHeart, 
  FaTimes, 
  FaChevronDown,
  FaChevronUp,
  FaSlidersH,
  FaTags,
  FaClock,
  FaStar
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdvancedSearchFilter = ({ 
  onSearchChange, 
  onFilterChange, 
  onSortChange,
  totalResults = 0,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    festival: '',
    dateRange: '',
    owner: '',
    hasImage: false,
    messageLength: '',
    sortBy: 'newest',
    sortOrder: 'desc'
  });

  // Festival options
  const festivalOptions = [
    'Christmas', 'Birthday', 'New Year', 'Valentine\'s Day', 'Easter',
    'Halloween', 'Thanksgiving', 'Anniversary', 'Graduation', 'Wedding',
    'Mother\'s Day', 'Father\'s Day', 'Independence Day', 'Labor Day',
    'Memorial Day', 'Veterans Day', 'Black Friday', 'Cyber Monday'
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: <FaClock /> },
    { value: 'oldest', label: 'Oldest First', icon: <FaClock /> },
    { value: 'name', label: 'Name A-Z', icon: <FaUser /> },
    { value: 'festival', label: 'Festival', icon: <FaTags /> },
    { value: 'messageLength', label: 'Message Length', icon: <FaHeart /> },
    { value: 'popular', label: 'Most Popular', icon: <FaStar /> }
  ];

  // Message length options
  const messageLengthOptions = [
    { value: '', label: 'Any Length' },
    { value: 'short', label: 'Short (1-50 chars)' },
    { value: 'medium', label: 'Medium (51-200 chars)' },
    { value: 'long', label: 'Long (201-500 chars)' }
  ];

  // Date range options
  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Handle search input change
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    onSearchChange(value);
  }, [onSearchChange]);

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  // Handle sort change
  const handleSortChange = useCallback((sortBy, sortOrder = 'desc') => {
    const newFilters = { ...filters, sortBy, sortOrder };
    setFilters(newFilters);
    onSortChange(sortBy, sortOrder);
  }, [filters, onSortChange]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      festival: '',
      dateRange: '',
      owner: '',
      hasImage: false,
      messageLength: '',
      sortBy: 'newest',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    onFilterChange(clearedFilters);
    onSearchChange('');
    toast.success('All filters cleared');
  }, [onFilterChange, onSearchChange]);

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.festival) count++;
    if (filters.dateRange) count++;
    if (filters.owner) count++;
    if (filters.hasImage) count++;
    if (filters.messageLength) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <motion.div 
      className={`bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FaSearch className="text-white text-xl" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Search & Filter
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              <span className="font-bold text-blue-600">{totalResults}</span> greeting cards found
            </p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <motion.span 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
            </motion.span>
          )}
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSlidersH />
            {isExpanded ? 'Hide' : 'Show'} Filters
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div 
        className="relative mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search by name, message, festival, or owner..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-14 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg bg-white shadow-sm hover:shadow-md focus:shadow-lg"
        />
        {searchTerm && (
          <motion.button
            onClick={() => handleSearchChange('')}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        )}
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Festival Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaTags className="inline mr-2" />
                  Festival
                </label>
                <select
                  value={filters.festival}
                  onChange={(e) => handleFilterChange('festival', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Festivals</option>
                  {festivalOptions.map(festival => (
                    <option key={festival} value={festival}>{festival}</option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Message Length Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaHeart className="inline mr-2" />
                  Message Length
                </label>
                <select
                  value={filters.messageLength}
                  onChange={(e) => handleFilterChange('messageLength', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {messageLengthOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Owner Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Owner Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Stacks address..."
                  value={filters.owner}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>

              {/* Has Image Filter */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasImage}
                    onChange={(e) => handleFilterChange('hasImage', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Has Custom Image
                  </span>
                </label>
              </div>
            </div>

            {/* Sort Options */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaSort />
                Sort Options
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {sortOptions.map((option, idx) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 font-semibold ${
                      filters.sortBy === option.value
                        ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.icon}
                    <span className="text-sm">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <motion.button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-semibold border-2 border-gray-200 hover:border-red-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes />
                Clear All Filters
              </motion.button>
              
              <div className="text-sm text-gray-600 font-medium">
                Showing results sorted by <span className="font-bold text-blue-600">{sortOptions.find(s => s.value === filters.sortBy)?.label}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearchFilter;
