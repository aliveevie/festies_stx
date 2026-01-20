import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Beautiful Slider Component
 * Range slider with smooth animations
 */
const Slider = ({
  min = 0,
  max = 100,
  value,
  onChange,
  step = 1,
  label,
  showValue = true,
  className = "",
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round((min + percentage * (max - min)) / step) * step;
    onChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">
            {label}
          </label>
          {showValue && (
            <span className="text-sm font-bold text-blue-600">{value}</span>
          )}
        </div>
      )}
      
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
        {...props}
      >
        <motion.div
          className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing"
          style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
          animate={{ 
            left: `${percentage}%`,
            scale: isDragging ? 1.2 : 1
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
// Style improvement
