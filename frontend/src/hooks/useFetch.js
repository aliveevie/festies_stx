import { useState, useEffect } from 'react';

/**
 * Hook to fetch data from an API
 * @param {string|Function} url - URL or function that returns URL
 * @param {object} options - Fetch options
 * @returns {object} - { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const urlString = typeof url === 'function' ? url() : url;
      const response = await fetch(urlString, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [typeof url === 'function' ? undefined : url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useFetch;
// Style improvement
// Performance optimization
