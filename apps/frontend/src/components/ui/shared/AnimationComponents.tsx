import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode, Children, isValidElement, cloneElement } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/design/hooks';

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const expandIn = {
  initial: { opacity: 0, height: 0, scaleY: 0.9 },
  animate: { opacity: 1, height: 'auto', scaleY: 1 },
  exit: { opacity: 0, height: 0, scaleY: 0.9 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: 'easeInOut' as const },
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
};

export const scaleOnTap = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.1, ease: 'easeOut' as const },
};

export const liftOnHover = {
  whileHover: { y: -4, boxShadow: '0 24px 48px rgba(0,0,0,0.5)' },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const glowOnHover = {
  whileHover: { boxShadow: '0 0 40px -8px oklch(0.6 0.25 280 / 0.5)' },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const magneticHover = {
  whileHover: { scale: 1.01 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

interface MotionDivProps {
  variant?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInScale' | 'slideInRight' | 'slideInLeft' | 'expandIn';
  stagger?: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
}

export function MotionDiv({ 
  variant = 'fadeInUp', 
  stagger = false, 
  delay = 0, 
  className, 
  children 
}: MotionDivProps) {
  const reducedMotion = useReducedMotion();
  
  const variants = {
    fadeIn: fadeIn,
    fadeInUp: fadeInUp,
    fadeInDown: fadeInDown,
    fadeInScale: fadeInScale,
    slideInRight: slideInRight,
    slideInLeft: slideInLeft,
    expandIn: expandIn,
  };

  const variantConfig = variants[variant];

  if (reducedMotion) {
    return (
      <div className={cn('animate-none', className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={stagger ? staggerContainer : undefined}
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      transition={{ ...variantConfig.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

interface MotionSpanProps {
  variant?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInScale';
  delay?: number;
  className?: string;
  children: ReactNode;
}

export function MotionSpan({ variant = 'fadeInUp', delay = 0, className, children }: MotionSpanProps) {
  const reducedMotion = useReducedMotion();
  
  const variants = {
    fadeIn: fadeIn,
    fadeInUp: fadeInUp,
    fadeInDown: fadeInDown,
    fadeInScale: fadeInScale,
  };

  const variantConfig = variants[variant];

  if (reducedMotion) {
    return (
      <span className={cn('animate-none', className)}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      transition={{ ...variantConfig.transition, delay }}
    >
      {children}
    </motion.span>
  );
}

export function StaggeredChildren({ 
  children, 
  className, 
  staggerDelay = 0.08,
  delayChildren = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      initial="initial"
      animate="animate"
    >
      {Children.map(children, (child, index) => 
        isValidElement(child) 
          ? cloneElement(child as React.ReactElement<any>, {
              variants: staggerItem,
              key: child.key ?? index,
            })
          : child
      )}
    </motion.div>
  );
}

export function AnimatePresenceWrapper({ 
  children, 
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function LoadingDots({ className, color = 'accent', size = 8 }: { className?: string; color?: string; size?: number }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <div className={cn('rounded-full', `bg-${color}-400`, `size-${size}`)} />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', `bg-${color}-400`, `size-${size}`)}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function PulseRing({ className, color = 'accent', size = 48 }: { className?: string; color?: string; size?: number }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={cn('relative', className)}>
        <div className={cn('absolute inset-0 rounded-full', `bg-${color}-500/20`, `size-${size}`)} />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <motion.div
        className={cn('absolute inset-0 rounded-full', `bg-${color}-500/30`, `size-${size}`)}
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className={cn('absolute inset-0 rounded-full', `bg-${color}-500/20`, `size-${size}`)}
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className={cn('absolute inset-0 rounded-full', `bg-${color}-500/10`, `size-${size}`)}
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 2, delay: 1, repeat: Infinity, ease: 'easeOut' }}
      />
    </div>
  );
}

export function WaveBars({ 
  className, 
  color = 'rose-500', 
  count = 5, 
  height = 24,
  active = true 
}: { className?: string; color?: string; count?: number; height?: number; active?: boolean }) {
  const reducedMotion = useReducedMotion();

  if (!active || reducedMotion) {
    return (
      <div className={cn('flex items-end gap-0.5', className)} style={{ height }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn('w-1 rounded-full transition-all', `bg-${color}/70`)}
            style={{ height: '30%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-0.5', className)} style={{ height }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('w-1 rounded-full', `bg-${color}/70`)}
          animate={{ 
            scaleY: [0.5, 1, 0.5],
            height: ['30%', '100%', '30%'],
          }}
          transition={{ 
            duration: 0.6 + Math.random() * 0.4, 
            delay: i * 0.1, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          style={{ height: `${40 + Math.sin(i * 1.5) * 30}%` }}
        />
      ))}
    </div>
  );
}