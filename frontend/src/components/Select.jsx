import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

/**
 * Beautiful Select Component
 * Custom dropdown select with search and animations
 */
const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  searchable = false,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
          flex items-center justify-between
          ${error 
            ? 'border-red-500 focus:border-red-600' 
            : 'border-gray-200 focus:border-blue-500'
          }
          focus:ring-4 focus:ring-blue-100
        `}
        {...props}
      >
        <span className={selectedOption ? 'text-gray-800' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-xl overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors
                        flex items-center justify-between
                        ${value === option.value ? 'bg-blue-50' : ''}
                      `}
                    >
                      <span>{option.label}</span>
                      {value === option.value && (
                        <FaCheck className="text-blue-500" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
// Style improvement
// Refactor improvement
