/**
 * Transition utilities for smooth animations and micro-interactions
 * Modern design system with consistent timing and easing
 */

export const transition = {
  // Fast transitions - for quick feedback
  fast: "transition-all duration-150 ease-out",
  
  // Standard transitions - default for most interactions
  default: "transition-all duration-200 ease-out",
  
  // Slow transitions - for major state changes
  slow: "transition-all duration-300 ease-out",
  
  // Bounce transitions - for playful interactions
  bounce: "transition-all duration-300 ease-bounce",
  
  // Smooth transitions - for fluid animations
  smooth: "transition-all duration-200 ease-in-out",
  
  // Color transitions - for theme changes
  colors: "transition-colors duration-200 ease-out",
  
  // Transform transitions - for movement
  transform: "transition-transform duration-200 ease-out",
  
  // Opacity transitions - for fade effects
  opacity: "transition-opacity duration-200 ease-out",
  
  // Shadow transitions - for depth changes
  shadow: "transition-shadow duration-200 ease-out",
  
  // Border transitions - for outline changes
  border: "transition-border-color duration-200 ease-out",
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
  // Scale effects - subtle and professional
  scale: "hover:scale-102",
  scaleSm: "hover:scale-101",
  scaleLg: "hover:scale-105",
  
  // Color effects
  bg: "hover:bg-opacity-90",
  brightness: "hover:brightness-105",
  
  // Shadow effects - modern depth
  shadow: "hover:shadow-md",
  shadowSm: "hover:shadow-sm",
  shadowLg: "hover:shadow-lg",
  shadowXl: "hover:shadow-xl",
  
  // Transform effects - smooth lift
  lift: "hover:-translate-y-0.5",
  liftSm: "hover:-translate-y-0.25",
  liftLg: "hover:-translate-y-1",
  
  // Border effects - subtle emphasis
  border: "hover:border-primary/20",
  
  // Text effects
  text: "hover:text-primary",
};

export const focus = {
  // Ring effects - consistent with new color system
  ring: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
  ringPrimary: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20",
  ringSuccess: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success/20",
  ringWarning: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning/20",
  ringError: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive/20",
  ringSubtle: "focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-border",
};

export const interactive = {
  // Button interactions - modern and subtle
  button: `${transition.default} ${hover.scale} ${hover.shadow} ${focus.ringSubtle}`,
  buttonPrimary: `${transition.default} ${hover.scale} ${hover.shadow} ${focus.ringPrimary}`,
  
  // Card interactions - elegant lift
  card: `${transition.default} ${hover.lift} ${hover.shadow} ${hover.border}`,
  cardInteractive: `${transition.default} ${hover.scaleSm} ${hover.shadowLg} ${hover.border}`,
  
  // Link interactions - smooth color transitions
  link: `${transition.colors} ${hover.text}`,
  linkUnderline: `${transition.colors} ${hover.text} hover:underline`,
  
  // Input interactions - clean focus states
  input: `${transition.colors} ${transition.border} ${focus.ringSubtle}`,
  inputFocused: `${transition.colors} ${transition.border} ${focus.ringPrimary}`,
  
  // Tab interactions - smooth transitions
  tab: `${transition.default} ${hover.lift} ${focus.ringSubtle}`,
  tabActive: `${transition.colors} ${focus.ringPrimary}`,
  
  // Navigation interactions
  nav: `${transition.colors} ${hover.text} ${hover.border}`,
  navItem: `${transition.colors} ${hover.lift} ${focus.ringSubtle}`,
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