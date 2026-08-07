import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
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
        glass: 'liquid-glass text-foreground transition-transform duration-300 ease-out will-change-transform hover:shadow-glow-accent',
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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const inputVariants = cva(
  'w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 backdrop-blur-sm transition-all duration-200 outline-none hover:border-white/20 focus:border-accent/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-white/10',
        error: 'border-destructive/50 focus:border-destructive focus:ring-destructive/10',
        success: 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/10',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-11 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
      withIcon: {
        true: 'pl-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const cardVariants = cva(
  'relative overflow-hidden rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border border-white/10 bg-background/40 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.35)]',
        glass: 'liquid-glass border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]',
        elevated: 'border border-white/10 bg-background/60 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.55)]',
        interactive: 'border border-white/10 bg-background/40 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.35)] hover:border-white/20 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]',
        gradient: 'border border-transparent bg-gradient-to-br from-accent/10 via-transparent to-fuchsia-500/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/5 text-muted-foreground',
        primary: 'border-accent/30 bg-accent/15 text-accent',
        success: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
        warning: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
        error: 'border-rose-500/30 bg-rose-500/15 text-rose-400',
        info: 'border-blue-500/30 bg-blue-500/15 text-blue-400',
        glass: 'liquid-glass text-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const containerVariants = cva(
  'mx-auto w-full px-4',
  {
    variants: {
      size: {
        sm: 'max-w-3xl',
        default: 'max-w-5xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export const sectionVariants = cva(
  'py-16 sm:py-20 lg:py-24 xl:py-28',
  {
    variants: {
      spacing: {
        none: '',
        sm: 'py-8 sm:py-12',
        default: 'py-16 sm:py-20',
        lg: 'py-24 sm:py-28',
        xl: 'py-32 sm:py-40',
      },
    },
    defaultVariants: {
      spacing: 'default',
    },
  }
);

export const headingVariants = cva(
  'font-display font-normal tracking-tight text-foreground',
  {
    variants: {
      level: {
        1: 'text-5xl leading-[1.02] tracking-[-1px] sm:text-6xl lg:text-7xl',
        2: 'text-4xl leading-[1.05] tracking-[-0.5px] sm:text-5xl lg:text-6xl',
        3: 'text-3xl leading-[1.1] sm:text-4xl',
        4: 'text-2xl leading-[1.2] sm:text-3xl',
        5: 'text-xl leading-[1.3] sm:text-2xl',
        6: 'text-lg leading-[1.4] sm:text-xl',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      level: 1,
      align: 'left',
    },
  }
);

export const textVariants = cva(
  'leading-relaxed',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      color: {
        primary: 'text-foreground',
        secondary: 'text-muted-foreground',
        muted: 'text-muted-foreground/70',
        accent: 'text-accent',
        success: 'text-emerald-400',
        warning: 'text-amber-400',
        error: 'text-rose-400',
      },
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      color: 'primary',
    },
  }
);

export const flexVariants = cva(
  'flex',
  {
    variants: {
      direction: {
        row: 'flex-row',
        col: 'flex-col',
        rowReverse: 'flex-row-reverse',
        colReverse: 'flex-col-reverse',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      gap: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
      },
      wrap: {
        true: 'flex-wrap',
        false: 'flex-nowrap',
      },
    },
    defaultVariants: {
      direction: 'row',
      align: 'stretch',
      justify: 'start',
      gap: 0,
      wrap: false,
    },
  }
);

export const gridVariants = cva(
  'grid',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        auto: 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
      },
      gap: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
      },
    },
    defaultVariants: {
      cols: 1,
      gap: 4,
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type ContainerVariants = VariantProps<typeof containerVariants>;
export type SectionVariants = VariantProps<typeof sectionVariants>;
export type HeadingVariants = VariantProps<typeof headingVariants>;
export type TextVariants = VariantProps<typeof textVariants>;
export type FlexVariants = VariantProps<typeof flexVariants>;
export type GridVariants = VariantProps<typeof gridVariants>;