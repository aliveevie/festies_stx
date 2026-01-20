import { motion } from 'framer-motion';

/**
 * Beautiful Radio Component
 * Radio button group with animations
 */
const Radio = ({
  options,
  value,
  onChange,
  name,
  label,
  className = ""
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <motion.div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${value === option.value
                    ? 'border-blue-500'
                    : 'border-gray-300'
                  }
                  transition-all duration-300
                `}
                animate={{
                  scale: value === option.value ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {value === option.value && (
                  <motion.div
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            </div>
            <span className="text-gray-700 font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Radio;
// Style improvement
