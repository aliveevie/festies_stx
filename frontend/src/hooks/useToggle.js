import { useState, useCallback } from 'react';

/**
 * Hook to toggle a boolean value
 * @param {boolean} initialValue - Initial boolean value
 * @returns {Array} - [value, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
};

export default useToggle;
// Style improvement
// Additional style improvement
