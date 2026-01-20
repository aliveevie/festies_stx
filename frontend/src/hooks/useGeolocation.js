/**
 * Hook for managing geolocation
 */
import { useState, useEffect } from 'react';

/**
 * Hook to get user geolocation
 * @param {Object} options - Geolocation options
 * @returns {Object} Geolocation state { position, error, loading }
 */
export const useGeolocation = (options = {}) => {
  const [state, setState] = useState({
    position: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: 'Geolocation is not supported',
        loading: false,
      });
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      ...options,
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          position: null,
          error: error.message,
          loading: false,
        });
      },
      defaultOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
};

/**
 * Hook to get current position once
 * @param {Object} options - Geolocation options
 * @returns {Object} Position and error { position, error, loading }
 */
export const useCurrentPosition = (options = {}) => {
  const [state, setState] = useState({
    position: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: 'Geolocation is not supported',
        loading: false,
      });
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          position: null,
          error: error.message,
          loading: false,
        });
      },
      defaultOptions
    );
  }, [options]);

  return state;
};
