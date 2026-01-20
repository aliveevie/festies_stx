/**
 * Hook for managing window focus events
 */
import { useState, useEffect } from 'react';

/**
 * Hook to track window focus state
 * @returns {boolean} True if window is focused
 */
export const useWindowFocus = () => {
  const [isFocused, setIsFocused] = useState(
    typeof document !== 'undefined' ? document.hasFocus() : true
  );

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return isFocused;
};

/**
 * Hook to track document visibility
 * @returns {boolean} True if document is visible
 */
export const useDocumentVisibility = () => {
  const [isVisible, setIsVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
};
// Style improvement
// Additional style improvement
