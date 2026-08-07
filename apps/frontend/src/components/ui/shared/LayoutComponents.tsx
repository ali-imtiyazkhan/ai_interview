import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader, Check } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  currentStep: number;
  loading?: boolean;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, loading, className }: ProgressStepsProps) {
  if (!loading) return null;

  return (
    <div className={cn('relative mt-8 space-y-3 border-t border-white/10 pt-6', className)}>
      {steps.map((step, i) => {
        const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';
        return (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-all duration-500',
                status === 'done' && 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
                status === 'active' && 'border-accent/50 bg-accent/10 text-accent',
                status === 'pending' && 'border-white/5 text-muted-foreground/30'
              )}
            >
              {status === 'done' ? (
                <Check className="size-3" />
              ) : status === 'active' ? (
                <Loader className="size-3 animate-spin" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span
              className={cn(
                'text-sm transition-all duration-500',
                status === 'done' && 'text-emerald-400',
                status === 'active' && 'text-foreground/80',
                status === 'pending' && 'text-muted-foreground/30'
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface FormCardProps {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  progressBar?: boolean;
  progressValue?: number;
}

export function FormCard({ 
  children, 
  className, 
  loading, 
  progressBar, 
  progressValue 
}: FormCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-500',
        loading && 'pointer-events-none',
        className
      )}
    >
      {progressBar && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-accent via-fuchsia-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${progressValue ?? 0}%` }}
          />
        </div>
      )}
      <div className="liquid-glass pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">{children}</div>
    </div>
  );
}

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
}

export function PageLayout({ 
  children, 
  className, 
  maxWidth = 'lg', 
  centered = true 
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      'mx-auto w-full px-4 sm:px-6',
      maxWidthClasses[maxWidth],
      centered && 'flex flex-col items-center',
      className
    )}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: 'none' | 'sm' | 'default' | 'lg' | 'xl';
}

const spacingClasses = {
  none: '',
  sm: 'py-8 sm:py-12',
  default: 'py-16 sm:py-20',
  lg: 'py-24 sm:py-28',
  xl: 'py-32 sm:py-40',
};

export function Section({ children, className, id, spacing = 'default' }: SectionProps) {
  return (
    <section id={id} className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

const containerSizes = {
  sm: 'max-w-3xl',
  default: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6', containerSizes[size], className)}>
      {children}
    </div>
  );
}