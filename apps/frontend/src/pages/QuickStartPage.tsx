import { useState, type ReactNode, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { AmbientBackground } from "../components/AmbientBackground";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader,
  CircleAlert,
  User,
  Briefcase,
  Sparkles,
  Code,
  Binary,
  Wand2,
  Clock,
} from "lucide-react";

const displayFont = { fontFamily: "'Instrument Serif', serif" };

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Kotlin",
  "Swift",
];

const EXPERIENCE_LEVELS = ["0-2 years", "3-5 years", "6-10 years", "10+ years"];

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

const TOPICS = [
  "Arrays",
  "Strings",
  "Hash Tables",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion & Backtracking",
  "Sorting & Searching",
  "Stacks & Queues",
  "Heaps",
  "Two Pointers",
  "Sliding Window",
];

type Mode = "GENERAL" | "DSA";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 backdrop-blur-sm transition-all duration-300 outline-none hover:border-white/20 focus:border-accent/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-accent/10";

const labelClass =
  "mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase";

const iconWrapClass = "pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2";

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex size-5 items-center justify-center rounded-md border border-accent/30 bg-accent/10 font-mono text-[10px] font-bold text-accent">
        {index}
      </span>
      <span className="text-[11px] font-semibold tracking-wider text-foreground/70 uppercase">{children}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
        active
          ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_20px_-6px_oklch(0.6_0.25_280/0.5)]"
          : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25 hover:text-foreground",
      )}
    >
      {active && <Check className="size-3" />}
      {children}
    </button>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300",
            value === option
              ? "border-accent/50 bg-accent/15 text-accent"
              : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25 hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function QuickStartPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("GENERAL");
  const [languages, setLanguages] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shake, setShake] = useState(false);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  function toggleLanguage(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }

  function toggleTopic(topic: string) {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "GENERAL" && languages.length === 0) {
      triggerShake();
      toast.error("Pick at least one language", { icon: <CircleAlert className="size-4" /> });
      return;
    }

    if (mode === "DSA" && topics.length === 0) {
      triggerShake();
      toast.error("Pick at least one DSA topic", { icon: <CircleAlert className="size-4" /> });
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/pre-interview/quick`, {
        mode,
        candidateName: candidateName || undefined,
        jobRole: jobRole || undefined,
        experienceLevel: experienceLevel || undefined,
        languages: mode === "GENERAL" ? languages : undefined,
        difficulty: mode === "DSA" ? difficulty : undefined,
        topics: mode === "DSA" ? topics : [],
      });

      setCurrentStep(1);
      setLoading(false);
      toast.success("Interview created! Generating your questions...", {
        icon: <Check className="size-4" />,
      });
      navigate(`/interview/${data.id}`);
    } catch (error) {
      setLoading(false);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Failed to connect to server"
        : "Something went wrong";
      toast.error(message, { icon: <CircleAlert className="size-4" /> });
    }
  }

  const steps = [
    { label: "Creating your interview session..." },
    { label: "Generating AI questions..." },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AmbientBackground />

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

      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-14 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-[1fr_minmax(380px,460px)] lg:gap-20">
        <div className="animate-fade-rise max-w-xl">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-xl">
            <Sparkles className="size-3.5 text-accent" />
            Quick Practice — no GitHub needed
          </div>

          <h1 className="text-5xl leading-[1.02] font-normal tracking-[-1px] sm:text-6xl lg:text-7xl" style={displayFont}>
            Practice <em className="text-muted-foreground not-italic">anytime</em>,
            anywhere.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pick your languages and experience level for a mock interview, or jump
            into DSA practice with difficulty and topics you choose. AI generates
            everything on the spot.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: Code, title: "Language-focused mock interviews", description: "Technical, behavioral and system design questions for your stack." },
              { icon: Binary, title: "DSA practice mode", description: "Coding problems at your chosen difficulty, answered in plain text." },
              { icon: Wand2, title: "Instant AI evaluation", description: "Every answer scored with feedback, strengths and weaknesses." },
            ].map((perk) => (
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
        </div>

        <div className="animate-fade-rise-delay">
          <div className="relative w-full max-w-md mx-auto">
            <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-accent/15 via-transparent to-transparent blur-2xl" />

            <div
              className={cn(
                "relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-500",
                loading && "pointer-events-none",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5">
                <div
                  className="h-full bg-gradient-to-r from-accent via-fuchsia-400 to-emerald-400 transition-all duration-700 ease-out"
                  style={{ width: loading ? `${((currentStep + 1) / 3) * 100}%` : "0%" }}
                />
              </div>

              <div className="liquid-glass pointer-events-none absolute inset-0 opacity-60" />

              <div className="relative mb-8 text-center">
                <div
                  className={cn(
                    "mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-white/10",
                    loading ? "bg-white/5" : "animate-glow bg-gradient-to-br from-accent/20 to-fuchsia-500/10",
                  )}
                >
                  {loading ? (
                    <Loader className="size-6 animate-spin text-accent" />
                  ) : (
                    <Sparkles className="size-6 text-accent" />
                  )}
                </div>

                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {loading ? "Setting up your session" : "Quick Start"}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground/70">
                  {loading ? "Please wait while we prepare your questions" : "Pick your mode and preferences"}
                </p>
              </div>

              <form onSubmit={onSubmit} className="relative space-y-7">
                <div>
                  <SectionLabel index="01">Mode</SectionLabel>
                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5">
                    {(
                      [
                        { value: "GENERAL", label: "Mock Interview", icon: Code },
                        { value: "DSA", label: "DSA Practice", icon: Binary },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMode(option.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg px-3 py-3 text-xs font-semibold transition-all duration-300",
                          mode === option.value
                            ? "bg-accent/20 text-accent shadow-inner border border-accent/40"
                            : "text-muted-foreground hover:text-foreground border border-transparent",
                        )}
                      >
                        <option.icon className="size-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {mode === "GENERAL" && (
                  <div className={cn(shake && languages.length === 0 && "animate-shake")}>
                    <SectionLabel index="02">Languages</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <Chip key={lang} active={languages.includes(lang)} onClick={() => toggleLanguage(lang)}>
                          {lang}
                        </Chip>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground/50">
                      Pick at least one — questions will focus on your stack.
                    </p>
                  </div>
                )}

                {mode === "DSA" && (
                  <>
                    <div className={cn(shake && topics.length === 0 && "animate-shake")}>
                      <SectionLabel index="02">Topics</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((topic) => (
                          <Chip key={topic} active={topics.includes(topic)} onClick={() => toggleTopic(topic)}>
                            {topic}
                          </Chip>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground/50">
                        Pick at least one topic to practice.
                      </p>
                    </div>

                    <div>
                      <SectionLabel index="03">Difficulty</SectionLabel>
                      <Segmented options={DIFFICULTIES} value={difficulty} onChange={(v) => setDifficulty(v)} />
                    </div>
                  </>
                )}

                <div>
                  <SectionLabel index={mode === "GENERAL" ? "03" : "04"}>Experience</SectionLabel>
                  <Segmented
                    options={EXPERIENCE_LEVELS}
                    value={experienceLevel}
                    onChange={(v) => setExperienceLevel(v)}
                  />
                </div>

                <div>
                  <SectionLabel index={mode === "GENERAL" ? "04" : "05"}>About You (optional)</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className={cn(iconWrapClass, "size-4 text-muted-foreground/40")} />
                      <input
                        id="candidateName"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>
                    <div className="relative">
                      <Briefcase className={cn(iconWrapClass, "size-4 text-muted-foreground/40")} />
                      <input
                        id="jobRole"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="Target role"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/50">
                    <Clock className="size-3.5" />
                    Helps the AI tailor questions to your goals.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="glass"
                  size="pill"
                  disabled={loading}
                  className="group relative h-12 w-full overflow-hidden rounded-xl text-sm font-semibold text-foreground"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent/90 via-fuchsia-500/80 to-accent/90 bg-[length:200%_100%] opacity-90 transition-all duration-500 group-hover:animate-gradient-shift group-hover:opacity-100" />
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader className="size-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="size-4" />
                        {mode === "DSA" ? "Generate DSA Problems" : "Generate My Interview"}
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              {loading && (
                <div className="relative mt-8 space-y-3 border-t border-white/10 pt-6">
                  {steps.map((step, i) => {
                    const status = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
                    return (
                      <div key={step.label} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-all duration-500",
                            status === "done" && "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
                            status === "active" && "border-accent/50 bg-accent/10 text-accent",
                            status === "pending" && "border-white/5 text-muted-foreground/30",
                          )}
                        >
                          {status === "done" ? (
                            <Check className="size-3" />
                          ) : status === "active" ? (
                            <Loader className="size-3 animate-spin" />
                          ) : (
                            <span>{i + 1}</span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm transition-all duration-500",
                            status === "done" && "text-emerald-400",
                            status === "active" && "text-foreground/80",
                            status === "pending" && "text-muted-foreground/30",
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
