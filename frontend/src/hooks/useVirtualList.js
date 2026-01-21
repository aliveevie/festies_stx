import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * useVirtualList Hook
 * Hook for efficiently rendering large lists by only rendering visible items
 */
const useVirtualList = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = useMemo(
    () => items.length * itemHeight,
    [items.length, itemHeight]
  );

  const visibleRange = useMemo(() => {
    const visibleStart = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const visibleEnd = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { start: visibleStart, end: visibleEnd };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(
    () => items.slice(visibleRange.start, visibleRange.end + 1),
    [items, visibleRange.start, visibleRange.end]
  );

  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const scrollToIndex = useCallback(
    (index) => {
      if (!containerRef.current) return;

      const targetScrollTop = index * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    },
    [itemHeight]
  );

  const scrollToTop = useCallback(() => {
    scrollToIndex(0);
  }, [scrollToIndex]);

  const scrollToBottom = useCallback(() => {
    scrollToIndex(items.length - 1);
  }, [scrollToIndex, items.length]);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    visibleStartIndex: visibleRange.start,
    visibleEndIndex: visibleRange.end,
    handleScroll,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  };
};

export default useVirtualList;
