import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Countdown Component
 * Displays a countdown timer with animations
 */
const Countdown = ({
  targetDate,
  onComplete,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  className = '',
  ...props
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      onComplete?.();
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference,
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ label, value }) => (
    <motion.div
      className="flex flex-col items-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 min-w-[80px] text-white shadow-lg"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="text-3xl font-bold"
        >
          {String(value).padStart(2, '0')}
        </motion.div>
      </AnimatePresence>
      <div className="text-xs mt-2 uppercase tracking-wider opacity-90">
        {label}
      </div>
    </motion.div>
  );

  if (timeLeft.total <= 0) {
    return (
      <div className={`text-center ${className}`} {...props}>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          Time's Up!
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} {...props}>
      {showDays && <TimeUnit label="Days" value={timeLeft.days} />}
      {showHours && <TimeUnit label="Hours" value={timeLeft.hours} />}
      {showMinutes && <TimeUnit label="Minutes" value={timeLeft.minutes} />}
      {showSeconds && <TimeUnit label="Seconds" value={timeLeft.seconds} />}
    </div>
  );
};

export default Countdown;
