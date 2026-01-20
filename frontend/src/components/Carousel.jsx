/**
 * Carousel component - Image/content carousel
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Carousel = ({
  items,
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goTo = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play
  React.useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, currentIndex]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div className="relative aspect-video">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Dots */}
        {showDots && items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${
                    index === currentIndex
                      ? 'bg-purple-400 w-8'
                      : 'bg-white/50 hover:bg-white/70'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
