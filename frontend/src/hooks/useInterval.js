import { useEffect, useRef } from 'react';

/**
 * Hook to run a function at intervals
 * @param {Function} callback - Function to run
 * @param {number|null} delay - Delay in milliseconds (null to stop)
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
