import { useEffect, useRef } from 'react';

/**
 * Hook to run a function after a delay
 * @param {Function} callback - Function to run
 * @param {number|null} delay - Delay in milliseconds (null to stop)
 */
export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
};

export default useTimeout;
// Style improvement
// Performance optimization
