import { Button } from "@/components/ui/shared";
import { MotionDiv, StaggeredChildren, PulseRing } from "@/components/ui/shared";
import { useTheme } from "@/design/theme";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Sparkles,
  Mic,
  BarChart3,
  ArrowRight,
  Code,
  UserRound,
  ScrollText,
  Play,
  Target,
  Zap,
  Award,
  Database,
  Users,
  HelpCircle,
  ClipboardCheck,
  LayoutDashboard,
  Sun,
  Moon,
  Contrast,
} from "lucide-react";

const VIDEO_SRC = "/assets/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Questions",
    description: "Questions generated from your GitHub repos and resume — tailored to your exact skill set and experience.",
  },
  {
    icon: Mic,
    title: "Audio & Text Answers",
    description: "Answer via text or voice recording. Our AI evaluates both your technical accuracy and communication clarity.",
  },
  {
    icon: BarChart3,
    title: "Detailed Scorecards",
    description: "Per-question scoring with category breakdowns. See your strengths and areas for improvement across every dimension.",
  },
  {
    icon: Sparkles,
    title: "Realistic Interview Flow",
    description: "Simulate real interview conditions with timed questions, skip options, and a natural question-by-question progression.",
  },
];

const displayFontClass = "font-display";

export function LandingPage() {
  const navigate = useNavigate();
  const { resolvedTheme, setMode, colorScheme, setColorScheme, toggleTheme } = useTheme();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <video
          className="h-full w-full object-cover"
          src={VIDEO_SRC}
          poster="/assets/ambient-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-background/40" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.6_0.25_280/0.1),transparent_70%),radial-gradient(ellipse_50%_40%_at_90%_100%,oklch(0.55_0.2_160/0.06),transparent_70%)]" />
      </div>

      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 text-2xl tracking-tight text-foreground font-display" aria-label="SkillScribe home">
            SkillScribe<sup className="text-xs">&reg;</sup>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "Pipeline", href: "#pipeline" },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href.slice(1))}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-ring"
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/setup")}
              className="rounded-lg text-xs font-semibold"
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/quick-start")}
              className="rounded-lg text-xs font-semibold"
            >
              Quick Start
            </Button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
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
            <Button
              size="sm"
              onClick={() => navigate("/setup")}
              className="rounded-lg text-xs font-semibold"
            >
              Start Interview
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-2">
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
            <Button
              size="sm"
              onClick={() => navigate("/setup")}
              className="rounded-lg text-xs font-semibold"
            >
              Start Interview
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
            <MotionDiv variant="fadeInUp" className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xl">
              <Sparkles className="size-3.5" />
              AI-Powered Mock Interviews
            </MotionDiv>

            <MotionDiv variant="fadeInUp" delay={0.1} className="max-w-5xl text-5xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-7xl sm:leading-[0.95] md:text-8xl md:leading-[0.95] font-display">
              Where <em className="not-italic text-muted-foreground">dreams</em> rise{" "}
              <em className="not-italic text-muted-foreground">through the silence.</em>
            </MotionDiv>

            <MotionDiv variant="fadeInUp" delay={0.2} className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We&rsquo;re designing tools for deep thinkers, bold creators, and quiet rebels.
              Amid the chaos, we build digital spaces for sharp focus and inspired work.
            </MotionDiv>

            <MotionDiv variant="fadeInUp" delay={0.3} className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/setup")}
                className="h-12 rounded-xl px-8 text-sm font-semibold shadow-lg group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent/90 via-fuchsia-500/80 to-accent/90 bg-[length:200%_100%] opacity-90 transition-all duration-500 group-hover:animate-gradient-shift group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  Start Your Interview
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                variant="glass"
                size="pill"
                onClick={() => navigate("/quick-start")}
                className="h-12 rounded-xl px-8 text-sm font-semibold"
              >
                <Zap className="size-4" />
                Quick Practice — No GitHub needed
              </Button>
            </MotionDiv>

            <MotionDiv variant="fadeInUp" delay={0.4} className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Code className="size-4" />
                GitHub
              </span>
              <span className="flex items-center gap-1.5">
                <ScrollText className="size-4" />
                Resume
              </span>
              <span className="flex items-center gap-1.5">
                <BrainCircuit className="size-4" />
                Local LLM
              </span>
              <span className="flex items-center gap-1.5 text-accent/80">
                <Target className="size-4" />
                AI-Powered
              </span>
            </MotionDiv>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <MotionDiv variant="fadeInUp" className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to{" "}
                <span className="text-foreground">Ace the Interview</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                From personalized question generation to detailed scorecards — every tool to help you prepare.
              </p>
            </MotionDiv>

            <StaggeredChildren staggerDelay={0.1} delayChildren={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <MotionDiv
                  key={feature.title}
                  variant="fadeInUp"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-background/60 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                    <feature.icon className="size-6 text-foreground" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </MotionDiv>
              ))}
            </StaggeredChildren>
          </div>
        </section>

        <section id="pipeline" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <MotionDiv variant="fadeInUp" className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From Profile to{" "}
                <span className="text-foreground">Scorecard</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                See how your data flows through the AI pipeline — fully automated, end to end.
              </p>
            </MotionDiv>

            <div className="relative mx-auto max-w-3xl">
              <div className="absolute top-0 bottom-0 left-6 hidden w-px bg-gradient-to-b from-white/5 via-white/20 to-white/5 md:block" />

              {[
                {
                  icon: Users,
                  title: "Profile Submission",
                  desc: "You submit your GitHub URL and resume. Optional metadata like name, role, and experience level is collected.",
                  badge: "Frontend",
                  color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                },
                {
                  icon: Database,
                  title: "Data Ingestion & Embedding",
                  desc: "Backend fetches repos, READMEs, and languages. Gemini embeds everything into vector chunks stored in pgvector.",
                  badge: "Backend",
                  color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
                },
                {
                  icon: BrainCircuit,
                  title: "Question Generation",
                  desc: "Gemini LLM generates tailored questions — technical, behavioral, project deep-dive, system design, and coding — from your embedded profile.",
                  badge: "AI",
                  color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
                },
                {
                  icon: HelpCircle,
                  title: "Interview Session",
                  desc: "Answer one question at a time via text or audio recording. Track progress, skip questions, and use Cmd+Enter to submit quickly.",
                  badge: "Frontend",
                  color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                },
                {
                  icon: ClipboardCheck,
                  title: "Answer Evaluation",
                  desc: "Each answer is scored (0-100) by Gemini with structured feedback, strengths, and weaknesses extracted automatically.",
                  badge: "AI",
                  color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
                },
                {
                  icon: LayoutDashboard,
                  title: "Results & Scorecard",
                  desc: "View your overall score, per-category breakdown, per-question cards with feedback, strengths, weaknesses, and audio playback.",
                  badge: "Frontend",
                  color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                },
              ].map((step, i) => (
                <MotionDiv
                  key={step.title}
                  variant="fadeInUp"
                  delay={i * 0.1}
                  className="group relative flex gap-5 pb-12 last:pb-0"
                >
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-background/60 backdrop-blur-xl transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent/10 group-hover:shadow-glow-accent">
                    <step.icon className="size-5 text-foreground transition-all duration-300 group-hover:text-accent" />
                    <PulseRing size={36} color="accent" className="absolute inset-0" />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${step.color}`}>
                        {step.badge}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                  {i < 5 && (
                    <div className="absolute top-12 left-[1.375rem] hidden h-full w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent md:block" />
                  )}
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        <section id="form" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <MotionDiv variant="fadeInUp" className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to <span className="text-foreground">Practice?</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Set up your profile and let the AI create a personalized interview for you.
              </p>
            </MotionDiv>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/setup")}
                className="h-12 rounded-xl px-8 text-sm font-semibold shadow-lg group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent/90 via-fuchsia-500/80 to-accent/90 bg-[length:200%_100%] opacity-90 transition-all duration-500 group-hover:animate-gradient-shift group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  Set Up Your Interview
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-background/40 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <a href="/" className="text-xl tracking-tight text-foreground font-display">
                  SkillScribe<sup className="text-xs">&reg;</sup>
                </a>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                AI-powered mock interviews that help you prepare for your next career move.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Features", id: "features" },
                  { label: "Pipeline", id: "pipeline" },
                  { label: "Get Started", id: "setup" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() =>
                        item.id === "setup" ? navigate("/setup") : scrollTo(item.id)
                      }
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Tech Stack</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>React 19 + TypeScript</li>
                <li>Tailwind CSS v4</li>
                <li>Bun Runtime</li>
                <li>Local LLM Backend</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SkillScribe. Powered by local LLM.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Play className="size-3" />
                Built with Bun
              </span>
              <span className="flex items-center gap-1.5">
                <BrainCircuit className="size-3" />
                Local-First
              </span>
              <span className="flex items-center gap-1.5 text-accent/70">
                <Award className="size-3" />
                AI-Powered
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}