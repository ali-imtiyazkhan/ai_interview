import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md",
        className,
      )}
    />
  );
}

export function InputSkeleton() {
  return <Skeleton className="h-10 w-full rounded-lg" />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/40 bg-card/50 p-6">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-5 w-3/5" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
