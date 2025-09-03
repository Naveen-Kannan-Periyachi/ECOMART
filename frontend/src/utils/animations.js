// Animation utilities for React components
import { useState, useRef, useEffect } from 'react';

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

export const slideInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// CSS class animations (for components without Framer Motion)
export const cssAnimations = {
  fadeIn: 'fade-in',
  slideUp: 'slide-up',
  scaleIn: 'scale-in',
  bounceIn: 'bounce-in',
  float: 'float'
};

// Hover animations
export const hoverScale = {
  hover: { scale: 1.05 },
  transition: { duration: 0.3 }
};

export const hoverLift = {
  hover: { y: -4 },
  transition: { duration: 0.3 }
};

// Loading animations
export const loadingDots = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

// Card animations
export const cardHover = {
  transform: 'translateY(-8px) scale(1.02)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
};

// Button animations
export const buttonPress = {
  transform: 'scale(0.98)',
  transition: 'transform 0.1s ease'
};

// Image zoom effect
export const imageZoom = {
  overflow: 'hidden',
  '& img': {
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  }
};

// Pulse animation for notifications
export const pulseAnimation = {
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
};

// Shimmer loading effect
export const shimmerEffect = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite'
};

// Glassmorphism effect
export const glassEffect = {
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '12px'
};

// Gradient text effect
export const gradientText = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

// Custom easing functions
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// Animation delay utilities
export const createStaggerDelay = (index, baseDelay = 0.1) => ({
  animationDelay: `${index * baseDelay}s`
});

// Animation hooks for React components
export const useIntersectionAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};
