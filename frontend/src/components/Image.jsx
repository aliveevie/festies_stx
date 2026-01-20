import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaImage } from 'react-icons/fa';
import Skeleton from './Skeleton';

/**
 * Beautiful Image Component
 * Image with loading state and error handling
 */
const Image = ({
  src,
  alt,
  fallback,
  className = "",
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  if (hasError && fallback) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0">
          <Skeleton variant="rectangular" className="w-full h-full" />
        </div>
      )}
      <motion.img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          transition-opacity duration-300
        `}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      />
    </div>
  );
};

export default Image;
