import { motion } from 'framer-motion';

/**
 * Beautiful Divider Component
 * Horizontal or vertical divider with optional text
 */
const Divider = ({
  text,
  orientation = 'horizontal',
  variant = 'solid',
  className = "",
}) => {
  const variants = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (orientation === 'vertical') {
    return (
      <div className={`h-full w-px bg-gray-200 ${className}`} />
    );
  }

  return (
    <div className={`flex items-center my-4 ${className}`}>
      <motion.div
        className={`flex-1 border-t-2 ${variants[variant]} border-gray-200`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
      {text && (
        <span className="px-4 text-sm text-gray-500 font-medium">
          {text}
        </span>
      )}
      {text && (
        <motion.div
          className={`flex-1 border-t-2 ${variants[variant]} border-gray-200`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
};

export default Divider;
