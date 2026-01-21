import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useDrag Hook
 * Hook for handling drag interactions on elements
 */
const useDrag = ({
  onDragStart,
  onDrag,
  onDragEnd,
  disabled = false,
  axis = 'both', // 'x', 'y', or 'both'
  bounds = null, // { left, right, top, bottom } or ref
} = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e) => {
      if (disabled) return;

      e.preventDefault();
      setIsDragging(true);

      const rect = elementRef.current?.getBoundingClientRect();
      const startX = e.clientX - (rect?.left || 0);
      const startY = e.clientY - (rect?.top || 0);

      startPosRef.current = { x: startX, y: startY };
      setDragStart({ x: e.clientX, y: e.clientY });

      onDragStart?.(e, { x: startX, y: startY });
    },
    [disabled, onDragStart]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || disabled) return;

      let deltaX = e.clientX - dragStart.x;
      let deltaY = e.clientY - dragStart.y;

      if (axis === 'x') deltaY = 0;
      if (axis === 'y') deltaX = 0;

      let newX = position.x + deltaX;
      let newY = position.y + deltaY;

      // Apply bounds if provided
      if (bounds) {
        const boundRect =
          typeof bounds === 'object' && 'current' in bounds
            ? bounds.current?.getBoundingClientRect()
            : null;

        if (boundRect) {
          const elementRect = elementRef.current?.getBoundingClientRect();
          const maxX = boundRect.right - (elementRect?.width || 0);
          const maxY = boundRect.bottom - (elementRect?.height || 0);

          newX = Math.max(boundRect.left, Math.min(newX, maxX));
          newY = Math.max(boundRect.top, Math.min(newY, maxY));
        } else if (typeof bounds === 'object') {
          if (bounds.left !== undefined) newX = Math.max(bounds.left, newX);
          if (bounds.right !== undefined) newX = Math.min(bounds.right, newX);
          if (bounds.top !== undefined) newY = Math.max(bounds.top, newY);
          if (bounds.bottom !== undefined) newY = Math.min(bounds.bottom, newY);
        }
      }

      const newPosition = { x: newX, y: newY };
      setPosition(newPosition);
      setDragStart({ x: e.clientX, y: e.clientY });

      onDrag?.(e, newPosition);
    },
    [isDragging, disabled, dragStart, position, axis, bounds, onDrag]
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (!isDragging || disabled) return;

      setIsDragging(false);
      onDragEnd?.(e, position);
    },
    [isDragging, disabled, position, onDragEnd]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch support
  const handleTouchStart = useCallback(
    (e) => {
      if (disabled) return;

      const touch = e.touches[0];
      const rect = elementRef.current?.getBoundingClientRect();
      const startX = touch.clientX - (rect?.left || 0);
      const startY = touch.clientY - (rect?.top || 0);

      startPosRef.current = { x: startX, y: startY };
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);

      onDragStart?.(e, { x: startX, y: startY });
    },
    [disabled, onDragStart]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || disabled) return;
      e.preventDefault();

      const touch = e.touches[0];
      let deltaX = touch.clientX - dragStart.x;
      let deltaY = touch.clientY - dragStart.y;

      if (axis === 'x') deltaY = 0;
      if (axis === 'y') deltaX = 0;

      const newPosition = { x: position.x + deltaX, y: position.y + deltaY };
      setPosition(newPosition);
      setDragStart({ x: touch.clientX, y: touch.clientY });

      onDrag?.(e, newPosition);
    },
    [isDragging, disabled, dragStart, position, axis, onDrag]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isDragging || disabled) return;

      setIsDragging(false);
      onDragEnd?.(e, position);
    },
    [isDragging, disabled, position, onDragEnd]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ref: elementRef,
    position,
    isDragging,
    handleMouseDown,
    resetPosition: () => setPosition({ x: 0, y: 0 }),
  };
};

export default useDrag;
// Style improvement
// Performance optimization
// Refactor improvement
// Additional style improvement
// Documentation update
