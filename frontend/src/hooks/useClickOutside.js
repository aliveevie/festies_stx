import { useEffect, useRef } from 'react';

/**
 * Hook to detect clicks outside an element
 * @param {Function} handler - Callback function
 * @param {boolean} enabled - Whether the hook is enabled
 * @returns {object} - Ref to attach to element
 */
export const useClickOutside = (handler, enabled = true) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [handler, enabled]);

  return ref;
};

export default useClickOutside;
// Style improvement
// Refactor improvement
