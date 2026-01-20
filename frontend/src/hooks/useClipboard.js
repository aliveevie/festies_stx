/**
 * Hook for managing clipboard operations
 */
import { useState, useCallback } from 'react';

/**
 * Hook to copy text to clipboard
 * @returns {Object} { copy, copied, error }
 */
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    try {
      setError(null);
      setCopied(false);

      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }

      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);

      return true;
    } catch (err) {
      setError(err.message);
      setCopied(false);
      return false;
    }
  }, []);

  return { copy, copied, error };
};

/**
 * Hook to read text from clipboard
 * @returns {Object} { read, text, error, loading }
 */
export const useClipboardRead = () => {
  const [text, setText] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const read = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }

      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setLoading(false);

      return clipboardText;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  return { read, text, error, loading };
};
