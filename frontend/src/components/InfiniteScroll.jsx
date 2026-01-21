import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

/**
 * InfiniteScroll Component
 * Automatically loads more content as user scrolls near the bottom
 */
const InfiniteScroll = ({
  children,
  onLoadMore,
  hasMore = true,
  isLoading = false,
  threshold = 200,
  loader = null,
  endMessage = null,
  className = '',
  ...props
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isLoading, threshold]);

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  const defaultLoader = (
    <div className="flex justify-center items-center py-8">
      <FaSpinner className="w-6 h-6 text-purple-500 animate-spin" />
    </div>
  );

  return (
    <div className={className} {...props}>
      {children}

      {isLoading && (loader || defaultLoader)}

      {!hasMore && endMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          {endMessage}
        </motion.div>
      )}

      {hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
    </div>
  );
};

export default InfiniteScroll;
// Style improvement
// Performance optimization
// Additional style improvement
// Documentation update
// Additional performance optimization
