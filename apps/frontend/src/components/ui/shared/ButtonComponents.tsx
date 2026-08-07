import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 hover:shadow-accent/25',
        glass: 'liquid-glass text-foreground transition-transform duration-300 ease-out will-change-transform hover:shadow-[0_0_30px_-8px_oklch(0.6_0.25_280/0.5)]',
        gradient: 'relative overflow-hidden bg-gradient-to-r from-accent via-fuchsia-500 to-emerald-400 text-foreground shadow-lg hover:opacity-90',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 rounded-xl px-6 has-[>svg]:px-4 text-base',
        xl: 'h-14 rounded-2xl px-8 has-[>svg]:px-5 text-lg',
        icon: 'size-10',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
        pill: 'rounded-full',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader className="size-4 animate-spin" aria-hidden="true" />
            {loadingText ?? 'Loading...'}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'glass' | 'accent';
  size?: 'sm' | 'default' | 'lg';
  'aria-label': string;
  children: React.ReactNode;
}

export function IconButton({ 
  variant = 'ghost', 
  size = 'default', 
  'aria-label': ariaLabel,
  children,
  className,
  ...props 
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'size-9',
    default: 'size-10',
    lg: 'size-12',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
    glass: 'liquid-glass text-foreground hover:shadow-[0_0_30px_-8px_oklch(0.6_0.25_280/0.5)]',
    accent: 'bg-accent text-accent-foreground shadow-lg hover:bg-accent/90',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({ 
  children, 
  strength = 0.3, 
  className, 
  onMouseMove,
  onMouseLeave,
  onMouseEnter,
  ...props 
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0, 0)';
    }
    onMouseLeave?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseEnter?.(e);
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'transition-transform duration-300 ease-out will-change-transform',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface PressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  scale?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Pressable({ 
  children, 
  onPress, 
  onPressStart, 
  onPressEnd, 
  scale = 0.98,
  disabled = false,
  className,
  style,
  ...props 
}: PressableProps) {
  const [pressed, setPressed] = React.useState(false);

  const handleMouseDown = () => {
    if (disabled) return;
    setPressed(true);
    onPressStart?.();
  };

  const handleMouseUp = () => {
    if (disabled) return;
    setPressed(false);
    onPressEnd?.();
    onPress?.();
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setPressed(false);
    onPressEnd?.();
  };

  const handleTouchStart = () => {
    if (disabled) return;
    setPressed(true);
    onPressStart?.();
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    setPressed(false);
    onPressEnd?.();
    onPress?.();
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        transform: pressed ? `scale(${scale})` : 'scale(1)',
        transition: 'transform 100ms ease-out',
        willChange: 'transform',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...style,
      }}
      className={cn('active:scale-[0.98]', className)}
      {...props}
    >
      {children}
    </div>
  );
}