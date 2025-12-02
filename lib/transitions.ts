/**
 * Modern transition utilities for smooth animations and micro-interactions
 * Stripe-inspired design system with consistent timing and easing
 */

export const transition = {
  // Fast transitions - for quick feedback
  fast: "transition-all duration-[150ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // Standard transitions - default for most interactions
  default: "transition-all duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // Normal transitions - balanced speed
  normal: "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
  
  // Slow transitions - for major state changes
  slow: "transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // Slower transitions - for complex animations
  slower: "transition-all duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
  
  // Spring transitions - for playful interactions
  spring: "transition-all duration-[300ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
  
  // Color transitions - for theme changes
  colors: "transition-colors duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // Transform transitions - for movement
  transform: "transition-transform duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // Opacity transitions - for fade effects
  opacity: "transition-opacity duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // Shadow transitions - for depth changes
  shadow: "transition-shadow duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // Border transitions - for outline changes
  border: "transition-border-color duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  
  // All properties - comprehensive transition
  all: "transition-all duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
};

export const animation = {
  // Fade animations
  fadeIn: "animate-fade-in",
  fadeOut: "animate-fade-out",
  
  // Slide animations
  slideIn: "animate-slide-in",
  slideOut: "animate-slide-out",
  slideInUp: "animate-slide-in-up",
  slideInDown: "animate-slide-in-down",
  
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
  bounceIn: "animate-bounce-in",
  
  // Modern micro-animations
  shimmer: "animate-shimmer",
  float: "animate-float",
  glow: "animate-glow",
  progressFill: "animate-progress-fill",
  checkmark: "animate-checkmark",
};

export const hover = {
  // Scale effects - subtle and professional
  scale: "hover:scale-[1.02]",
  scaleSm: "hover:scale-[1.01]",
  scaleLg: "hover:scale-[1.05]",
  
  // Color effects
  bg: "hover:bg-opacity-90",
  brightness: "hover:brightness-105",
  
  // Shadow effects - modern depth with new shadow system
  shadow: "hover:shadow-md",
  shadowSm: "hover:shadow-sm",
  shadowLg: "hover:shadow-lg",
  shadowXl: "hover:shadow-xl",
  
  // Transform effects - smooth lift
  lift: "hover:-translate-y-[2px]",
  liftSm: "hover:-translate-y-[1px]",
  liftLg: "hover:-translate-y-[4px]",
  
  // Border effects - subtle emphasis with new colors
  border: "hover:border-primary/20",
  
  // Text effects
  text: "hover:text-primary",
  
  // Glassmorphism effects
  glass: "hover:bg-white/80 hover:backdrop-blur-sm",
  
  // Modern interactions
  glow: "hover:shadow-lg hover:shadow-primary/10",
};

export const focus = {
  // Ring effects - consistent with new color system
  ring: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
  ringPrimary: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20",
  ringSuccess: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success/20",
  ringWarning: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning/20",
  ringError: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error/20",
  ringSubtle: "focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-border",
  
  // Modern focus states
  ringOffset: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
  ringInset: "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/20",
};

export const interactive = {
  // Button interactions - modern and subtle
  button: `${transition.default} ${hover.scale} ${hover.shadow} ${focus.ringSubtle}`,
  buttonPrimary: `${transition.default} ${hover.scale} ${hover.shadow} ${focus.ringPrimary}`,
  buttonGhost: `${transition.colors} ${hover.scale} ${focus.ringSubtle}`,
  buttonOutline: `${transition.colors} ${hover.border} ${hover.shadow} ${focus.ringSubtle}`,
  
  // Card interactions - elegant lift with glassmorphism
  card: `${transition.default} ${hover.lift} ${hover.shadow} ${hover.border}`,
  cardInteractive: `${transition.default} ${hover.scaleSm} ${hover.shadowLg} ${hover.border}`,
  cardGlass: `${transition.default} ${hover.glass} ${hover.shadow} ${hover.border}`,
  
  // Link interactions - smooth color transitions
  link: `${transition.colors} ${hover.text}`,
  linkUnderline: `${transition.colors} ${hover.text} hover:underline`,
  
  // Input interactions - clean focus states
  input: `${transition.colors} ${transition.border} ${focus.ringSubtle}`,
  inputFocused: `${transition.colors} ${transition.border} ${focus.ringPrimary}`,
  inputError: `${transition.colors} ${transition.border} ${focus.ringError}`,
  
  // Tab interactions - smooth transitions
  tab: `${transition.default} ${hover.lift} ${focus.ringSubtle}`,
  tabActive: `${transition.colors} ${focus.ringPrimary}`,
  
  // Navigation interactions
  nav: `${transition.colors} ${hover.text} ${hover.border}`,
  navItem: `${transition.colors} ${hover.lift} ${focus.ringSubtle}`,
  
  // Modern interactive elements
  dropdown: `${transition.all} ${hover.shadow} ${focus.ringSubtle}`,
  modal: `${transition.all} ${hover.shadow} ${focus.ringSubtle}`,
  tooltip: `${transition.all} ${hover.shadow} ${focus.ringSubtle}`,
};

// Custom animation keyframes for modern design system
export const keyframes = {
  fadeIn: {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  
  fadeOut: {
    from: { opacity: "1" },
    to: { opacity: "0" },
  },
  
  slideIn: {
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(0)" },
  },
  
  slideInUp: {
    from: { transform: "translateY(20px)", opacity: "0" },
    to: { transform: "translateY(0)", opacity: "1" },
  },
  
  slideInDown: {
    from: { transform: "translateY(-20px)", opacity: "0" },
    to: { transform: "translateY(0)", opacity: "1" },
  },
  
  scaleIn: {
    from: { transform: "scale(0.95)", opacity: "0" },
    to: { transform: "scale(1)", opacity: "1" },
  },
  
  scaleOut: {
    from: { transform: "scale(1)", opacity: "1" },
    to: { transform: "scale(0.95)", opacity: "0" },
  },
  
  bounceIn: {
    "0%": { transform: "scale(0.3)", opacity: "0" },
    "50%": { transform: "scale(1.05)" },
    "70%": { transform: "scale(0.9)" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
  
  shimmer: {
    "0%": { backgroundPosition: "-1000px 0" },
    "100%": { backgroundPosition: "1000px 0" },
  },
  
  progressFill: {
    from: { width: "0%" },
    to: { width: "var(--progress-width, 100%)" },
  },
  
  checkmark: {
    "0%": { strokeDashoffset: "100" },
    "100%": { strokeDashoffset: "0" },
  },
  
  float: {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
  },
  
  glow: {
    "0%, 100%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.5)" },
    "50%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.8)" },
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