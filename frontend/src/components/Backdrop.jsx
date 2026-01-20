import { motion, AnimatePresence } from 'framer-motion';

/**
 * Beautiful Backdrop Component
 * Modal backdrop with blur effect
 */
const Backdrop = ({
  isOpen,
  onClick,
  blur = true,
  opacity = 0.5,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClick}
          className={`
            fixed inset-0 z-40
            ${blur ? 'backdrop-blur-sm' : ''}
            bg-black
            ${className}
          `}
        />
      )}
    </AnimatePresence>
  );
};

export default Backdrop;
