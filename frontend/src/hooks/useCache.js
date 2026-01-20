import { useState, useEffect } from 'react';
import { getCache, setCache, removeCache } from '../services/cache';

/**
 * Hook for managing cached data
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch data
 * @param {number} ttl - Time to live in milliseconds
 * @returns {object} - { data, loading, error, refetch }
 */
export const useCache = (key, fetchFn, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get from cache first
      const cached = getCache(key);
      if (cached !== null) {
        setData(cached);
        setLoading(false);
        return;
      }
      
      // Fetch fresh data
      const freshData = await fetchFn();
      setData(freshData);
      setCache(key, freshData, ttl);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [key]);

  const refetch = () => {
    removeCache(key);
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useCache;
