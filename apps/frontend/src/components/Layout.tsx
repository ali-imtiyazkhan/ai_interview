import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { AmbientBackground } from "@/components/ui/shared";
import { useTheme } from "@/design/theme";
import { Button } from "@/components/ui/shared";
import { Mic, BarChart3, Sparkles, ArrowLeft, Sun, Moon, Contrast } from "lucide-react";

const displayFont = { fontFamily: "'Instrument Serif', serif" };

interface RouteInfo {
  name: string;
  icon: typeof Mic;
}

const routes: [string, RouteInfo][] = [
  ["/interview", { name: "Interview", icon: Mic }],
  ["/result", { name: "Results", icon: BarChart3 }],
];

function matchRoute(pathname: string): RouteInfo | null {
  for (const [pattern, info] of routes) {
    if (pathname === pattern || pathname.startsWith(pattern + "/")) {
      return info;
    }
  }
  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const route = matchRoute(location.pathname);
  const { resolvedTheme, toggleTheme, colorScheme, setColorScheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AmbientBackground variant="particles" />

      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-2xl tracking-tight text-foreground"
            style={displayFont}
            aria-label="SkillScribe home"
          >
            SkillScribe<sup className="text-xs">&reg;</sup>
          </Link>

          <div className="flex items-center gap-3">
            {route && (
              <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-xl sm:inline-flex">
                <route.icon className="size-3.5 text-accent" />
                {route.name}
              </span>
            )}
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                className="text-muted-foreground hover:text-foreground"
              >
                {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setColorScheme(colorScheme === 'high-contrast' ? 'default' : 'high-contrast')}
                aria-label={`Toggle high contrast mode`}
                className="text-muted-foreground hover:text-foreground"
              >
                <Contrast className="size-5" />
              </Button>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-ring"
            >
              <ArrowLeft className="size-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-1 flex-col px-4 pt-24 pb-16 sm:px-6">
        <div className="animate-fade-in flex flex-1 flex-col" key={location.pathname}>
          {children}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-background/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-accent" />
            SkillScribe — AI-powered mock interviews
          </p>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} SkillScribe. Powered by local LLM.
          </p>
        </div>
      </footer>
    </div>
  );
}