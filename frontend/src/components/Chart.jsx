/**
 * Chart component - Data visualization
 */
import React from 'react';
import { motion } from 'framer-motion';

export const Chart = ({
  data,
  type = 'line',
  width = '100%',
  height = 300,
  color = 'purple',
  className = '',
}) => {
  const colors = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
  };

  const maxValue = Math.max(...data.map((d) => d.value));

  if (type === 'bar') {
    return (
      <div
        className={`
          bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 
          border border-purple-500/30 rounded-xl p-6
          ${className}
        `}
        style={{ width, height }}
      >
        <div className="flex items-end justify-between h-full gap-2">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className={`
                flex-1 bg-gradient-to-t ${colors[color]} 
                rounded-t-lg min-h-[4px] relative group
              `}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-800 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Line chart
  return (
    <div
      className={`
        bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 
        border border-purple-500/30 rounded-xl p-6
        ${className}
      `}
      style={{ width, height }}
    >
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <polyline
          points={data
            .map(
              (item, index) =>
                `${(index / (data.length - 1)) * 100}%,${
                  100 - (item.value / maxValue) * 100
                }%`
            )
            .join(' ')}
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth="2"
          className="text-purple-500"
        />
        
        {data.map((item, index) => (
          <motion.circle
            key={index}
            cx={`${(index / (data.length - 1)) * 100}%`}
            cy={`${100 - (item.value / maxValue) * 100}%`}
            r="4"
            fill="currentColor"
            className="text-purple-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </svg>
    </div>
  );
};
// Style improvement
// Performance optimization
// Additional style improvement
