/**
 * ============================================================================
 * Framer Motion Animation Variants
 * ============================================================================
 * Comprehensive animation variants for consistent page transitions and effects
 * ============================================================================
 */

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 0.95,
  },
};

export const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.6,
};

// Container variants for staggered animations
export const containerVariants = {
  hidden: { 
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Item variants for list animations
export const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Card variants for card animations
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Hover variants
export const hoverVariants = {
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

// Fade in variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Slide in variants
export const slideInVariants = {
  hidden: { 
    opacity: 0,
    x: -50,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Scale in variants
export const scaleInVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Rotate variants
export const rotateVariants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Pulse variants
export const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Bounce variants
export const bounceVariants = {
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Shake variants
export const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Common transition presets
export const transitions = {
  smooth: {
    type: "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: 0.3,
  },
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
};
// Style improvement 48
// Style improvement 49
// Performance optimization 57
// Refactor improvement 83
// Documentation update 108
// Version 133
