import { motion } from 'framer-motion';

/**
 * Marquee Component
 * Animated scrolling text/content component with customizable speed and direction
 */
const Marquee = ({
  children,
  speed = 50,
  direction = 'left',
  pauseOnHover = false,
  className = '',
  gradient = true,
  ...props
}) => {
  const duration = speed; // pixels per second

  const variants = {
    left: {
      animate: {
        x: ['0%', '-100%'],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'linear',
          },
        },
      },
    },
    right: {
      animate: {
        x: ['-100%', '0%'],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'linear',
          },
        },
      },
    },
    up: {
      animate: {
        y: ['0%', '-100%'],
        transition: {
          y: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'linear',
          },
        },
      },
    },
    down: {
      animate: {
        y: ['-100%', '0%'],
        transition: {
          y: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'linear',
          },
        },
      },
    },
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {gradient && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 z-10 pointer-events-none" />
        </>
      )}
      <motion.div
        className="flex whitespace-nowrap"
        variants={variants[direction]}
        animate="animate"
        {...(pauseOnHover && {
          whileHover: { animationPlayState: 'paused' },
        })}
      >
        {/* Duplicate content for seamless loop */}
        <div className="flex-shrink-0">{children}</div>
        <div className="flex-shrink-0">{children}</div>
        <div className="flex-shrink-0">{children}</div>
      </motion.div>
    </div>
  );
};

export default Marquee;
// Style improvement
