/**
 * Hook for keyboard events
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to listen for key presses
 * @param {string|string[]} keys - Key(s) to listen for
 * @param {Function} callback - Callback function
 * @param {Object} options - Options
 */
export const useKeyboard = (keys, callback, options = {}) => {
  const { enabled = true, target = window, exact = false } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const key = event.key.toLowerCase();
      const code = event.code.toLowerCase();

      const matches = keyList.some((k) => {
        const kLower = k.toLowerCase();
        if (exact) {
          return key === kLower || code === kLower;
        }
        return (
          key === kLower ||
          code === kLower ||
          key === kLower.replace('key', '')
        );
      });

      if (matches) {
        event.preventDefault();
        callback(event);
      }
    };

    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callback, enabled, target, exact]);
};

/**
 * Hook to listen for specific key combination
 * @param {string} key - Key to listen for
 * @param {string[]} modifiers - Modifier keys (ctrl, alt, shift, meta)
 * @param {Function} callback - Callback function
 * @param {Object} options - Options
 */
export const useKeyboardShortcut = (
  key,
  modifiers = [],
  callback,
  options = {}
) => {
  const { enabled = true, target = window } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const modifiersMatch = modifiers.every((mod) => {
        switch (mod.toLowerCase()) {
          case 'ctrl':
            return event.ctrlKey;
          case 'alt':
            return event.altKey;
          case 'shift':
            return event.shiftKey;
          case 'meta':
            return event.metaKey;
          default:
            return false;
        }
      });

      if (keyMatch && modifiersMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, modifiers, callback, enabled, target]);
};

/**
 * Hook to listen for escape key
 * @param {Function} callback - Callback function
 * @param {Object} options - Options
 */
export const useEscapeKey = (callback, options = {}) => {
  return useKeyboard('Escape', callback, options);
};

/**
 * Hook to detect if key is currently pressed
 * @param {string} targetKey - Key to detect
 * @returns {boolean} True if key is pressed
 */
export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};
// Style improvement
