import { useState, useEffect, useCallback } from 'react';

/**
 * useCountdown Hook
 * Hook for creating countdown timers
 */
const useCountdown = (targetDate, options = {}) => {
  const {
    interval = 1000,
    onComplete,
    onTick,
  } = options;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
    isExpired: false,
  });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
        isExpired: true,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference,
      isExpired: false,
    };
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      onTick?.(newTimeLeft);

      if (newTimeLeft.isExpired) {
        clearInterval(timer);
        onComplete?.();
      }
    }, interval);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, interval, calculateTimeLeft, onComplete, onTick]);

  const format = useCallback((formatString = 'DD:HH:MM:SS') => {
    const { days, hours, minutes, seconds } = timeLeft;
    
    return formatString
      .replace('DD', String(days).padStart(2, '0'))
      .replace('HH', String(hours).padStart(2, '0'))
      .replace('MM', String(minutes).padStart(2, '0'))
      .replace('SS', String(seconds).padStart(2, '0'))
      .replace('D', String(days))
      .replace('H', String(hours))
      .replace('M', String(minutes))
      .replace('S', String(seconds));
  }, [timeLeft]);

  return {
    ...timeLeft,
    format,
  };
};

export default useCountdown;
// Style improvement
// Performance optimization
