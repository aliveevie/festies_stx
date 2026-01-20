import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

/**
 * Beautiful Rating Component
 * Star rating with interactive selection
 */
const Rating = ({
  value = 0,
  max = 5,
  onChange,
  readonly = false,
  size = 'md',
  className = "",
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const rating = index + 1;
        const isFilled = rating <= displayValue;

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !readonly && setHoverValue(rating)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            disabled={readonly}
            className={`
              ${sizes[size]} transition-colors
              ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
              ${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
            `}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
          >
            <FaStar />
          </motion.button>
        );
      })}
    </div>
  );
};

export default Rating;
