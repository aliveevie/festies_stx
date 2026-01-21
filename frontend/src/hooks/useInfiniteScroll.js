import { useEffect, useRef, useState } from 'react';

/**
 * useInfiniteScroll Hook
 * Hook for implementing infinite scroll functionality
 */
const useInfiniteScroll = ({
  hasNextPage = true,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 200,
  enabled = true,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage) return;

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
  }, [hasNextPage, isFetchingNextPage, threshold, enabled]);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    sentinelRef,
    isIntersecting,
  };
};

export default useInfiniteScroll;
// Style improvement
