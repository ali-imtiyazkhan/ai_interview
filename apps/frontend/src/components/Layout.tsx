import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const routeNames: Record<string, string> = {
  "/": "Setup",
  "/interview": "Interview",
  "/result": "Results",
};

const routeIcons: Record<string, string> = {
  "/": "⚡",
  "/interview": "🎙️",
  "/result": "📊",
};

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const routeName = routeNames[location.pathname] ?? "Interview AI";
  const routeIcon = routeIcons[location.pathname] ?? "🎯";

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-sm">
              {routeIcon}
            </span>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Interview AI</h1>
              <p className="text-[11px] text-muted-foreground">{routeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">System Ready</span>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto mt-14 flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-fade-in flex flex-1 flex-col" key={location.pathname}>
          {children}
        </div>
      </main>

      <footer className="border-t border-border/20 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Interview AI &mdash; Powered by local LLM
        </p>
      </footer>
    </div>
  );
}
