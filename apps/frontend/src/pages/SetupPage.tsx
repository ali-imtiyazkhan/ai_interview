import { Link } from "react-router-dom";
import { Form } from "../components/Form";
import { ArrowLeft, Sparkles, GitBranch, Target, BarChart3, ShieldCheck } from "lucide-react";

const VIDEO_SRC = "/assets/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const displayFont = { fontFamily: "'Instrument Serif', serif" };

const perks = [
  {
    icon: GitBranch,
    title: "GitHub deep-dive",
    description: "Your repos, READMEs and tech stack become the interview material.",
  },
  {
    icon: Target,
    title: "Role-tailored questions",
    description: "Technical, behavioral and project questions matched to your target role.",
  },
  {
    icon: BarChart3,
    title: "Instant scorecards",
    description: "Per-question scoring with strengths and areas to improve.",
  },
];

export function SetupPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
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

      <div className="fixed inset-0 z-[1] bg-background/40" />

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

          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-14 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-[1fr_minmax(380px,440px)] lg:gap-20">
        {/* Left — messaging */}
        <div className="animate-fade-rise max-w-xl">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xl">
            <Sparkles className="size-3.5 text-accent" />
            Setup — takes less than a minute
          </div>

          <h1 className="text-5xl leading-[1.02] font-normal tracking-[-1px] sm:text-6xl lg:text-7xl" style={displayFont}>
            Your story,{" "}
            <em className="text-muted-foreground not-italic">engineered</em>{" "}
            into questions.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Connect your GitHub profile and optional details. Our AI builds a
            personalized mock interview from your real projects — then scores
            every answer with detailed feedback.
          </p>

          <div className="mt-10 space-y-5">
            {perks.map((perk) => (
              <div key={perk.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
                  <perk.icon className="size-4.5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{perk.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground/70">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-5 border-t border-white/10 pt-6 text-xs text-muted-foreground/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-400/80" />
              No sign-up needed
            </span>
            <span className="size-1 rounded-full bg-white/10" />
            <span>Local LLM · Private</span>
            <span className="size-1 rounded-full bg-white/10" />
            <span>Free forever</span>
          </div>
        </div>

        {/* Right — form */}
        <div className="animate-fade-rise-delay">
          <Form />
        </div>
      </main>
    </div>
  );
}
