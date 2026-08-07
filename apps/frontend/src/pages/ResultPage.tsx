import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/shared";
import { Celebration, ScoreRing } from "@/components/ui/shared";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
import { Skeleton } from "../components/Skeleton";
import { MotionDiv, StaggeredChildren } from "@/components/ui/shared";
import {
  ArrowLeft,
  Check,
  Loader,
  CircleAlert,
  Sparkles,
  Code,
  Users,
  Lightbulb,
  Layers,
  Terminal,
  BrainCircuit,
  Trophy,
  Play,
  User,
  Briefcase,
  Clock,
  Target,
  Binary,
} from "lucide-react";

const displayFont = { fontFamily: "'Instrument Serif', serif" };

interface QuestionResult {
  question: string;
  category: string;
  answer: string | null;
  audioUrl: string | null;
  score: number | null;
  feedback: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
}

interface InterviewResult {
  id: string;
  status: string;
  candidateName: string | null;
  jobRole: string | null;
  experienceLevel: string | null;
  averageScore: number;
  questions: QuestionResult[];
}

const categoryConfig: Record<string, { label: string; icon: typeof Code; color: string }> = {
  TECHNICAL: { label: "Technical", icon: Code, color: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30" },
  BEHAVIORAL: { label: "Behavioral", icon: Users, color: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30" },
  PROJECT_DEEP_DIVE: { label: "Project Deep Dive", icon: Layers, color: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30" },
  SKILL_ASSESSMENT: { label: "Skill Assessment", icon: Lightbulb, color: "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30" },
  SYSTEM_DESIGN: { label: "System Design", icon: Terminal, color: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30" },
  CODING: { label: "Coding", icon: BrainCircuit, color: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30" },
  DSA: { label: "DSA Problem", icon: Binary, color: "from-fuchsia-500/20 to-fuchsia-600/10 text-fuchsia-400 border-fuchsia-500/30" },
};

function getCategoryConfig(category: string) {
  return categoryConfig[category] ?? { label: category, icon: BrainCircuit, color: "from-neutral-500/20 to-neutral-600/10 text-neutral-400 border-neutral-500/30" };
}

function getScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
}

function getScoreRingColor(score: number | null): string {
  if (score === null) return "stroke-muted-foreground";
  if (score >= 80) return "stroke-emerald-500";
  if (score >= 60) return "stroke-amber-500";
  return "stroke-rose-500";
}

function getGrade(score: number | null): { label: string; color: string } {
  if (score === null) return { label: "N/A", color: "text-muted-foreground" };
  if (score >= 90) return { label: "Excellent", color: "text-emerald-400" };
  if (score >= 80) return { label: "Great", color: "text-emerald-400" };
  if (score >= 70) return { label: "Good", color: "text-amber-400" };
  if (score >= 60) return { label: "Fair", color: "text-amber-400" };
  return { label: "Needs Improvement", color: "text-rose-400" };
}

export function ResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No interview ID provided");
      setLoading(false);
      return;
    }

    async function fetchResult() {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/v1/interview/${id}/result`);
        setResult(data);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Failed to fetch results"
          : "Something went wrong";
        setError(message);
        toast.error(message, {
          icon: <CircleAlert className="size-4" />,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 py-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <Skeleton className="mx-auto mb-4 size-20 rounded-3xl" />
          <Skeleton className="h-8 w-48" />
          <div className="mt-4 flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-background/40 p-8 backdrop-blur-2xl">
          <Skeleton className="size-[140px] rounded-full" />
          <div className="text-center space-y-2">
            <Skeleton className="mx-auto h-6 w-28" />
            <Skeleton className="mx-auto h-4 w-24" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-background/40 p-4 backdrop-blur-xl">
              <Skeleton className="mx-auto mb-2 size-4" />
              <Skeleton className="mx-auto mb-1 h-3 w-20" />
              <Skeleton className="mx-auto h-6 w-12" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-background/40 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="size-12 shrink-0 rounded-xl" />
              </div>
              <Skeleton className="mb-3 h-4 w-20" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MotionDiv variant="fadeInScale" className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 px-14 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="liquid-glass pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-destructive/10">
              <CircleAlert className="size-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
            <p className="mt-2 mb-6 text-muted-foreground">{error ?? "Result not found"}</p>
            <Button onClick={() => navigate("/")} variant="glass" className="gap-2">
              <ArrowLeft className="size-4" />
              Back to Home
            </Button>
          </div>
        </MotionDiv>
      </div>
    );
  }

  const { averageScore, questions, candidateName, jobRole, experienceLevel, status } = result;
  const grade = getGrade(averageScore);
  const answeredCount = questions.filter((q) => q.answer !== null).length;

  const categoryScores = questions.reduce<Record<string, number[]>>((acc, q) => {
    if (q.score !== null) {
      (acc[q.category] ??= []).push(q.score);
    }
    return acc;
  }, {});

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 py-4">
      <MotionDiv variant="fadeInDown" className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="relative">
            <div className="absolute -inset-3 animate-glow rounded-full" />
            <Trophy className="size-8 text-accent" />
          </div>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl" style={displayFont}>
          Interview Results
        </h2>

        {(candidateName || jobRole || experienceLevel) && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            {candidateName && (
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {candidateName}
              </span>
            )}
            {jobRole && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-3.5" />
                {jobRole}
              </span>
            )}
            {experienceLevel && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {experienceLevel}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center justify-center gap-3 text-sm">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium",
            status === "Done"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/30",
          )}>
            {status === "Done" ? "Completed" : "In Progress"}
          </span>
          <span className="text-muted-foreground">
            {answeredCount} of {questions.length} answered
          </span>
        </div>
      </MotionDiv>

      <Celebration score={averageScore} className="relative mb-8" />

      {Object.keys(categoryScores).length > 0 && (
        <MotionDiv variant="fadeInUp" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(categoryScores).map(([cat, scores]) => {
            const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            const cfg = getCategoryConfig(cat);
            return (
              <MotionDiv
                key={cat}
                variant="fadeInUp"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/40 p-4 text-center backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-accent/30 hover:shadow-[0_0_40px_-8px_oklch(0.6_0.25_280/0.15)]"
              >
                <div className="liquid-glass pointer-events-none absolute inset-0 opacity-40" />
                <div className="relative">
                  <div className={cn(
                    "mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:scale-110",
                    getScoreColor(avg).replace("text-", "bg-").replace("400", "500/15"),
                  )}>
                    <cfg.icon className={cn("size-5", getScoreColor(avg))} />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{cfg.label}</p>
                  <p className={cn("mt-0.5 text-xl font-bold", getScoreColor(avg))}>{avg}</p>
                </div>
              </MotionDiv>
            );
          })}
        </MotionDiv>
      )}

      <StaggeredChildren staggerDelay={0.08} delayChildren={0.1} className="space-y-4">
        {questions.map((q, i) => {
          const category = getCategoryConfig(q.category);
          const qGrade = getGrade(q.score);

          return (
            <MotionDiv
              key={i}
              variant="fadeInUp"
              className="group animate-fade-in-up relative overflow-hidden rounded-2xl border border-white/10 bg-background/40 p-6 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="liquid-glass pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-b px-3 py-1 text-xs font-medium",
                        category.color,
                      )}
                    >
                      <category.icon className="size-3.5" />
                      {category.label}
                    </span>
                    <p className="text-base font-medium leading-relaxed text-foreground">
                      {i + 1}. {q.question}
                    </p>
                  </div>
                  {q.score !== null && (
                    <div className="flex shrink-0 flex-col items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <span className={cn("text-xl font-bold tabular-nums", getScoreColor(q.score))}>
                        {q.score}
                      </span>
                      <span className={cn("text-[10px] font-medium uppercase tracking-wider", qGrade.color)}>{qGrade.label}</span>
                    </div>
                  )}
                </div>

                {q.answer ? (
                  <div className="mb-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Check className="size-3.5" />
                      Your Answer
                    </p>
                    <p className="rounded-lg bg-white/5 px-3 py-2 text-sm leading-relaxed text-foreground/80">
                      {q.answer}
                    </p>
                  </div>
                ) : (
                  <div className="mb-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CircleAlert className="size-3.5" />
                      Not Answered
                    </p>
                  </div>
                )}

                {q.audioUrl && (
                  <div className="mb-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Play className="size-3.5" />
                      Recording
                    </p>
                    <audio controls src={q.audioUrl} className="h-8 w-full" />
                  </div>
                )}

                {q.feedback && (
                  <div className="mb-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Sparkles className="size-3.5" />
                      Feedback
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/70">{q.feedback}</p>
                  </div>
                )}

                {q.strengths && q.strengths.length > 0 && (
                  <div className="mb-2 space-y-1">
                    <p className="text-xs font-medium text-emerald-400">Strengths</p>
                    <ul className="space-y-0.5">
                      {q.strengths.map((s, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-sm text-foreground/70">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500/60" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {q.weaknesses && q.weaknesses.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-rose-400">Areas for Improvement</p>
                    <ul className="space-y-0.5">
                      {q.weaknesses.map((w, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-sm text-foreground/70">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-500/60" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </MotionDiv>
          );
        })}
      </StaggeredChildren>

      <div className="mt-10 flex justify-center">
        <Button
          onClick={() => navigate("/")}
          variant="glass"
          className="h-11 gap-2 rounded-xl px-8 text-sm font-semibold"
        >
          <ArrowLeft className="size-4" />
          New Interview
        </Button>
      </div>
    </div>
  );
}