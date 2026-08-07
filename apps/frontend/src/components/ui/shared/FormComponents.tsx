import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionLabelProps {
  index: string;
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ index, children, className }: SectionLabelProps) {
  return (
    <div className={cn('mb-4 flex items-center gap-2.5', className)}>
      <span className="flex size-5 items-center justify-center rounded-md border border-accent/30 bg-accent/10 font-mono text-[10px] font-bold text-accent">
        {index}
      </span>
      <span className="text-[11px] font-semibold tracking-wider text-foreground/70 uppercase">{children}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function Chip({ active, onClick, children, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300',
        active
          ? 'border-accent/50 bg-accent/15 text-accent shadow-[0_0_20px_-6px_oklch(0.6_0.25_280/0.5)]'
          : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/25 hover:text-foreground',
        className
      )}
    >
      {active && <span className="size-3">✓</span>}
      {children}
    </button>
  );
}

interface SegmentedProps<T extends string> {
  options: readonly T[];
  value: T | '';
  onChange: (v: T) => void;
  className?: string;
}

export function Segmented<T extends string>({ 
  options, 
  value, 
  onChange, 
  className 
}: SegmentedProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300',
            value === option
              ? 'border-accent/50 bg-accent/15 text-accent'
              : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/25 hover:text-foreground'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export const inputClass = 
  'w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 backdrop-blur-sm transition-all duration-300 outline-none hover:border-white/20 focus:border-accent/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-accent/10';

export const labelClass = 
  'mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase';

export const iconWrapClass = 
  'pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2';

export function InputWithIcon({
  icon: Icon,
  iconClassName,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className={cn(iconWrapClass, 'size-4 text-muted-foreground/40', iconClassName)} />
      )}
      <input
        className={cn(inputClass, className)}
        {...props}
      />
    </div>
  );
}

export function SelectWithIcon({
  icon: Icon,
  iconClassName,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className={cn(iconWrapClass, 'size-4 text-muted-foreground/40', iconClassName)} />
      )}
      <select
        className={cn(
          'h-[42px] w-full rounded-xl border-white/10 bg-white/5 px-11 text-sm text-foreground backdrop-blur-sm outline-none transition-all duration-300 hover:border-white/20 focus:border-accent/50 focus:ring-4 focus:ring-accent/10',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}