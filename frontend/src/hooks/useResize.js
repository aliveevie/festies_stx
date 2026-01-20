/**
 * Hook for managing window resize events
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to track window size
 * @returns {Object} Window dimensions { width, height }
 */
export const useResize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

/**
 * Hook to track element size
 * @param {Object} ref - Element ref
 * @returns {Object} Element dimensions { width, height }
 */
export const useElementSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return size;
};

/**
 * Hook for breakpoint detection
 * @param {Object} breakpoints - Breakpoint map
 * @returns {string} Current breakpoint name
 */
export const useBreakpoint = (breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}) => {
  const [breakpoint, setBreakpoint] = useState('xs');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let currentBreakpoint = 'xs';

      Object.entries(breakpoints)
        .sort(([, a], [, b]) => b - a)
        .forEach(([name, value]) => {
          if (width >= value && currentBreakpoint === 'xs') {
            currentBreakpoint = name;
          }
        });

      setBreakpoint(currentBreakpoint);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return breakpoint;
};
// Style improvement
