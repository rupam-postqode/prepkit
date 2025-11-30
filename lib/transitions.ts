/**
 * Transition utilities for smooth animations and micro-interactions
 */

export const transition = {
  // Fast transitions
  fast: "transition-all duration-150 ease-out",
  
  // Standard transitions
  default: "transition-all duration-300 ease-out",
  
  // Slow transitions
  slow: "transition-all duration-500 ease-out",
  
  // Bounce transitions
  bounce: "transition-all duration-300 ease-bounce",
  
  // Smooth transitions
  smooth: "transition-all duration-200 ease-in-out",
  
  // Color transitions
  colors: "transition-colors duration-200 ease-out",
  
  // Transform transitions
  transform: "transition-transform duration-200 ease-out",
  
  // Opacity transitions
  opacity: "transition-opacity duration-200 ease-out",
};

export const animation = {
  // Fade animations
  fadeIn: "animate-fade-in",
  fadeOut: "animate-fade-out",
  
  // Slide animations
  slideIn: "animate-slide-in",
  slideOut: "animate-slide-out",
  
  // Scale animations
  scaleIn: "animate-scale-in",
  scaleOut: "animate-scale-out",
  
  // Pulse animations
  pulse: "animate-pulse",
  ping: "animate-ping",
  
  // Spin animations
  spin: "animate-spin",
  
  // Bounce animations
  bounce: "animate-bounce",
};

export const hover = {
  // Scale effects
  scale: "hover:scale-105",
  scaleSm: "hover:scale-102",
  scaleLg: "hover:scale-110",
  
  // Color effects
  bg: "hover:bg-opacity-90",
  brightness: "hover:brightness-110",
  
  // Shadow effects
  shadow: "hover:shadow-lg",
  shadowSm: "hover:shadow-md",
  shadowLg: "hover:shadow-xl",
  
  // Transform effects
  lift: "hover:-translate-y-1",
  liftSm: "hover:-translate-y-0.5",
  liftLg: "hover:-translate-y-2",
};

export const focus = {
  // Ring effects
  ring: "focus:outline-none focus:ring-2 focus:ring-offset-2",
  ringPrimary: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
  ringSuccess: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
  ringWarning: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500",
  ringError: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
};

export const interactive = {
  // Button interactions
  button: `${transition.default} ${hover.scale} ${hover.shadow} ${focus.ring}`,
  
  // Card interactions
  card: `${transition.default} ${hover.lift} ${hover.shadow}`,
  
  // Link interactions
  link: `${transition.colors} ${hover.brightness}`,
  
  // Input interactions
  input: `${transition.colors} ${focus.ring}`,
  
  // Tab interactions
  tab: `${transition.default} ${hover.lift} ${focus.ring}`,
};

// Custom animation keyframes
export const keyframes = {
  fadeIn: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  
  slideIn: {
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(0)" },
  },
  
  scaleIn: {
    from: { transform: "scale(0.95)", opacity: "0" },
    to: { transform: "scale(1)", opacity: "1" },
  },
  
  bounceIn: {
    "0%": { transform: "scale(0.3)", opacity: "0" },
    "50%": { transform: "scale(1.05)" },
    "70%": { transform: "scale(0.9)" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
};

// Utility functions for programmatic animations
export const animateElement = (
  element: HTMLElement,
  animationClass: string,
  duration: number = 300
): Promise<void> => {
  return new Promise((resolve) => {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
      resolve();
    }, duration);
  });
};

export const staggerAnimation = (
  elements: HTMLElement[],
  animationClass: string,
  staggerDelay: number = 100
): Promise<void> => {
  return new Promise((resolve) => {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animationClass);
      }, index * staggerDelay);
    });
    
    setTimeout(() => {
      elements.forEach(element => {
        element.classList.remove(animationClass);
      });
      resolve();
    }, elements.length * staggerDelay + 300);
  });
};