import { Form } from "./Form";
import { HeroIllustration } from "./HeroIllustration";
import { Button } from "./ui/button";
import { Toaster } from "sonner";
import {
  BrainCircuit,
  Sparkles,
  Mic,
  BarChart3,
  ArrowRight,
  ChevronDown,
  Code,
  UserRound,
  ScrollText,
  Play,
  FileCheck,
} from "lucide-react";

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

const steps = [
  {
    icon: Code,
    title: "Connect Your Profiles",
    description: "Link your GitHub and upload your resume so the AI can analyze your projects, skills, and experience.",
  },
  {
    icon: BrainCircuit,
    title: "AI Generates Questions",
    description: "Our local LLM creates personalized questions targeting your tech stack, role, and experience level.",
  },
  {
    icon: Mic,
    title: "Answer with Text or Audio",
    description: "Type your response or record with your microphone. Skip questions you don't want to answer.",
  },
  {
    icon: FileCheck,
    title: "Get Detailed Feedback",
    description: "Receive scores, AI feedback, strengths, and areas for improvement for every single question.",
  },
];

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Get Started", href: "#form" },
];

export function Landing() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-accent/10">
              <BrainCircuit className="size-5 text-accent" />
            </div>
            <span className="text-base font-bold tracking-tight">
              Interview <span className="text-accent">AI</span>
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href.slice(1))}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => scrollTo("form")}
              className="rounded-lg text-xs font-semibold"
            >
              Start Interview
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden pt-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 left-1/4 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute right-0 bottom-0 size-80 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <Sparkles className="size-3.5" />
                AI-Powered Mock Interviews
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Practice Interviews{" "}
                <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Connect your GitHub and upload your resume to get a personalized interview experience generated by a local LLM.
                Answer questions, get scored, and improve with detailed feedback.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => scrollTo("form")}
                  className="h-12 rounded-xl px-8 text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-accent/25"
                >
                  Start Your Interview
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollTo("features")}
                  className="h-12 rounded-xl px-8 text-sm font-semibold"
                >
                  Explore Features
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
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
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-lg">
                <HeroIllustration />
              </div>
            </div>
          </div>

          <button
            onClick={() => scrollTo("features")}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float text-muted-foreground/40 transition-colors hover:text-accent"
          >
            <ChevronDown className="size-6" />
          </button>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border/20 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to{" "}
                <span className="text-accent">Ace the Interview</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                From personalized question generation to detailed scorecards — every tool to help you prepare.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border/40 bg-card/30 p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent/20 hover:bg-card/50 hover:shadow-[0_0_40px_-12px_oklch(0.6_0.25_280/0.12)]"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                    <feature.icon className="size-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-border/20 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From Profile to Feedback in{" "}
                <span className="text-accent">4 Simple Steps</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                No sign-up, no setup. Just connect your profiles and start practicing.
              </p>
            </div>

            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Connector line */}
              <div className="absolute top-8 left-0 right-0 hidden h-px bg-gradient-to-r from-accent/5 via-accent/20 to-accent/5 lg:block" />

              {steps.map((step, i) => (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    <step.icon className="size-7 text-accent" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form" className="border-t border-border/20 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to <span className="text-accent">Practice?</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Enter your details below and let the AI create a personalized interview for you.
              </p>
            </div>

            <div className="mx-auto max-w-md">
              <Form />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10">
                  <BrainCircuit className="size-4 text-accent" />
                </div>
                <span className="text-sm font-bold">
                  Interview <span className="text-accent">AI</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                AI-powered mock interviews that help you prepare for your next career move.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                {["Features", "How It Works", "Get Started"].map((label) => (
                  <li key={label}>
                    <button
                      onClick={() => scrollTo(label.toLowerCase().replace(/\s+/g, "-"))}
                      className="text-sm text-muted-foreground transition-colors hover:text-accent"
                    >
                      {label}
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

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/20 pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Interview AI. Powered by local LLM.
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
            </div>
          </div>
        </div>
      </footer>

      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "oklch(0.13 0 0)",
            border: "1px solid oklch(0.25 0 0 / 0.5)",
            color: "oklch(0.95 0 0)",
          },
        }}
      />
    </div>
  );
}
