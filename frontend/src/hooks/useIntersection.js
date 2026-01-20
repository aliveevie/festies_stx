/**
 * Hook for intersection observer
 */
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to detect if element is in viewport
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting]
 */
export const useIntersection = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [elementRef, isIntersecting, entry];
};

/**
 * Hook to detect when element enters viewport
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, hasIntersected]
 */
export const useInView = (options = {}) => {
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return [elementRef, hasIntersected];
};

/**
 * Hook to track multiple elements intersection
 * @param {Object} options - Intersection observer options
 * @returns {Object} { ref, isIntersecting, entries }
 */
export const useMultipleIntersections = (options = {}) => {
  const [intersections, setIntersections] = useState(new Map());
  const elementsRef = useRef(new Map());

  const setRef = useCallback((key, element) => {
    if (element) {
      elementsRef.current.set(key, element);
    } else {
      elementsRef.current.delete(key);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = Array.from(elementsRef.current.entries()).find(
            ([, el]) => el === entry.target
          )?.[0];

          if (key) {
            setIntersections((prev) => {
              const next = new Map(prev);
              next.set(key, {
                isIntersecting: entry.isIntersecting,
                entry,
              });
              return next;
            });
          }
        });
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    elementsRef.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { setRef, intersections };
};
// Style improvement
// Performance optimization
