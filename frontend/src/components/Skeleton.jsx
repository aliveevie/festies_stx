import { motion } from 'framer-motion';

/**
 * Beautiful Skeleton Component
 * Loading skeleton with shimmer effect
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = "",
  count = 1,
}) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const baseClasses = `
    bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
    bg-[length:200%_100%]
    ${variants[variant]}
    ${className}
  `;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={baseClasses}
          style={{
            width: width || (variant === 'circular' ? height : '100%'),
            height: height || (variant === 'circular' ? width : '1rem'),
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;
