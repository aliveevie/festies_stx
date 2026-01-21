import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * VirtualList Component
 * Efficiently renders large lists by only rendering visible items
 */
const VirtualList = ({
  items,
  itemHeight,
  renderItem,
  containerHeight = 400,
  overscan = 5,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = items.length * itemHeight;
  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleEnd = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(visibleStart, visibleEnd + 1);
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: `${containerHeight}px` }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <motion.div
              key={visibleStart + index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ height: `${itemHeight}px` }}
            >
              {renderItem(item, visibleStart + index)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
// Style improvement
// Performance optimization
// Additional style improvement
// Documentation update
// Additional performance optimization
