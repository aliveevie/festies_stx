import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../services/analytics';

/**
 * Hook to automatically track page views
 */
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, {
      search: location.search,
      hash: location.hash,
    });
  }, [location]);
};

export default useAnalytics;
