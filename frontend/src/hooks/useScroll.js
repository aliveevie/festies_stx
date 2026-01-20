/**
 * Hook for managing scroll position and events
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to track scroll position
 * @returns {Object} Scroll position { x, y }
 */
export const useScroll = () => {
  const [position, setPosition] = useState({
    x: typeof window !== 'undefined' ? window.pageXOffset : 0,
    y: typeof window !== 'undefined' ? window.pageYOffset : 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
};

/**
 * Hook to scroll to element or position
 * @returns {Function} Scroll function
 */
export const useScrollTo = () => {
  const scrollTo = useCallback((target, options = {}) => {
    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    };

    if (typeof target === 'number') {
      // Scroll to position
      window.scrollTo({
        top: target,
        behavior: options.behavior || 'smooth',
      });
    } else if (typeof target === 'string') {
      // Scroll to selector
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ ...defaultOptions, ...options });
      }
    } else if (target instanceof Element) {
      // Scroll to element
      target.scrollIntoView({ ...defaultOptions, ...options });
    }
  }, []);

  return scrollTo;
};

/**
 * Hook to detect scroll direction
 * @returns {string} Scroll direction ('up' | 'down' | null)
 */
export const useScrollDirection = () => {
  const [direction, setDirection] = useState(null);
  const prevY = useState(0)[0];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.pageYOffset;
      
      if (currentY > prevY[0]) {
        setDirection('down');
      } else if (currentY < prevY[0]) {
        setDirection('up');
      }
      
      prevY[0] = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevY]);

  return direction;
};
