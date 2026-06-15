import { Form } from "./Form";
import { Button } from "./ui/button";
import { Toaster } from "sonner";
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
  FileCheck,
} from "lucide-react";

const VIDEO_SRC = "/assets/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Questions",
    description: "Questions generated from your GitHub repos and LinkedIn profile — tailored to your exact skill set and experience.",
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
    description: "Link your GitHub and LinkedIn so the AI can analyze your projects, skills, and experience.",
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

const displayFont = { fontFamily: "'Instrument Serif', serif" };

export function VelorahLanding() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Fixed Video Background */}
      <video
        className="fixed inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Overlay so content is readable */}
      <div className="fixed inset-0 z-[1] bg-background/40" />

      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5 text-2xl tracking-tight text-foreground" style={displayFont} aria-label="SkillScribe home">
            SkillScribe<sup className="text-xs">&reg;</sup>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Get Started", href: "#form" },
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href.slice(1))}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <Button
            size="sm"
            onClick={() => scrollTo("form")}
            className="rounded-lg text-xs font-semibold"
          >
            Start Interview
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-foreground">
              <Sparkles className="size-3.5" />
              AI-Powered Mock Interviews
            </div>

            <h1
              className="animate-fade-rise max-w-5xl text-5xl font-normal leading-[0.95] tracking-[-1.5px] sm:text-7xl sm:leading-[0.95] md:text-8xl md:leading-[0.95]"
              style={displayFont}
            >
              Where <em className="not-italic text-muted-foreground">dreams</em> rise{" "}
              <em className="not-italic text-muted-foreground">through the silence.</em>
            </h1>

            <p className="animate-fade-rise-delay mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We&rsquo;re designing tools for deep thinkers, bold creators, and quiet rebels.
              Amid the chaos, we build digital spaces for sharp focus and inspired work.
            </p>

            <div className="animate-fade-rise-delay-2 mt-10 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => scrollTo("form")}
                className="h-12 rounded-xl px-8 text-sm font-semibold shadow-lg"
              >
                Start Your Interview
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="glass"
                size="pill"
                onClick={() => scrollTo("features")}
                className="h-12 rounded-xl px-8 text-sm font-semibold"
              >
                Explore Features
              </Button>
            </div>

            <div className="animate-fade-rise-delay-2 mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Code className="size-4" />
                GitHub
              </span>
              <span className="flex items-center gap-1.5">
                <UserRound className="size-4" />
                LinkedIn
              </span>
              <span className="flex items-center gap-1.5">
                <ScrollText className="size-4" />
                Local LLM
              </span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to{" "}
                <span className="text-foreground">Ace the Interview</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                From personalized question generation to detailed scorecards — every tool to help you prepare.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/10 bg-background/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-background/60"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                    <feature.icon className="size-6 text-foreground" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From Profile to Feedback in{" "}
                <span className="text-foreground">4 Simple Steps</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                No sign-up, no setup. Just connect your profiles and start practicing.
              </p>
            </div>

            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="absolute top-8 left-0 right-0 hidden h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5 lg:block" />

              {steps.map((step, i) => (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                    <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                      {i + 1}
                    </span>
                    <step.icon className="size-7 text-foreground" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to <span className="text-foreground">Practice?</span>
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
      <footer className="relative z-10 border-t border-white/10 bg-background/40 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <a href="/" className="text-xl tracking-tight text-foreground" style={displayFont}>
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
                  { label: "How It Works", id: "how-it-works" },
                  { label: "Get Started", id: "form" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
