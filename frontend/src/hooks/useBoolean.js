import { useState, useCallback } from 'react';

/**
 * Custom hook for boolean state with helper methods
 * @param {boolean} initialValue - The initial boolean value
 * @returns {object} - Object with value and helper methods
 */
export const useBoolean = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const set = useCallback((val) => setValue(val), []);

  return {
    value,
    setValue: set,
    setTrue,
    setFalse,
    toggle,
    set,
  };
};

export default useBoolean;
