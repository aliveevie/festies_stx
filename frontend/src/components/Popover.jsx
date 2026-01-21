import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

/**
 * Popover Component
 * A flexible popover/dropdown component with positioning and animations
 */
const Popover = ({
  trigger,
  content,
  placement = 'bottom',
  offset = 8,
  showArrow = true,
  isOpen: controlledIsOpen,
  onOpenChange,
  className = '',
  contentClassName = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const isControlled = controlledIsOpen !== undefined;

  const open = isControlled ? controlledIsOpen : isOpen;

  // Handle click outside
  useEffect(() => {
    if (!open || isControlled) return;

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open, isControlled, onOpenChange]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const updatePosition = () => {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let top = 0;
        let left = 0;

        switch (placement) {
          case 'top':
            top = triggerRect.top + scrollY - popoverRect.height - offset;
            left = triggerRect.left + scrollX + triggerRect.width / 2 - popoverRect.width / 2;
            break;
          case 'bottom':
            top = triggerRect.bottom + scrollY + offset;
            left = triggerRect.left + scrollX + triggerRect.width / 2 - popoverRect.width / 2;
            break;
          case 'left':
            top = triggerRect.top + scrollY + triggerRect.height / 2 - popoverRect.height / 2;
            left = triggerRect.left + scrollX - popoverRect.width - offset;
            break;
          case 'right':
            top = triggerRect.top + scrollY + triggerRect.height / 2 - popoverRect.height / 2;
            left = triggerRect.right + scrollX + offset;
            break;
          default:
            top = triggerRect.bottom + scrollY + offset;
            left = triggerRect.left + scrollX;
        }

        // Keep within viewport
        const padding = 8;
        if (top < scrollY + padding) top = scrollY + padding;
        if (left < scrollX + padding) left = scrollX + padding;
        if (left + popoverRect.width > window.innerWidth + scrollX - padding) {
          left = window.innerWidth + scrollX - popoverRect.width - padding;
        }

        setPosition({ top, left });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, placement, offset]);

  useClickOutside(() => {
    if (!isControlled && open) {
      setIsOpen(false);
      onOpenChange?.(false);
    }
  }, open && !isControlled);

  const handleToggle = () => {
    if (!isControlled) {
      const newOpen = !isOpen;
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: placement === 'top' ? 10 : placement === 'bottom' ? -10 : 0,
      x: placement === 'left' ? 10 : placement === 'right' ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className={className}
        {...props}
      >
        {trigger}
      </div>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={popoverRef}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants}
                transition={{ duration: 0.2 }}
                className={`fixed z-50 ${contentClassName}`}
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                  {showArrow && (
                    <div
                      className={`absolute w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 ${
                        placement === 'top'
                          ? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45'
                          : placement === 'bottom'
                          ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45'
                          : placement === 'left'
                          ? 'right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 rotate-45'
                          : 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 rotate-45'
                      }`}
                    />
                  )}
                  {content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default Popover;
// Style improvement
// Refactor improvement
// Additional style improvement
// Documentation update
// Additional performance optimization
