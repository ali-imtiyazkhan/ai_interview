import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
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
  Target,
} from "lucide-react";

interface QuestionResult {
  question: string;
  category: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
}

interface InterviewResult {
  id: string;
  status: string;
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

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.25 0 0 / 0.5)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={getScoreRingColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span className={cn("absolute text-3xl font-bold", getScoreColor(score))}>
        {score}
      </span>
    </div>
  );
}

function getGrade(score: number | null): { label: string; color: string } {
  if (score === null) return { label: "N/A", color: "text-muted-foreground" };
  if (score >= 90) return { label: "Excellent", color: "text-emerald-400" };
  if (score >= 80) return { label: "Great", color: "text-emerald-400" };
  if (score >= 70) return { label: "Good", color: "text-amber-400" };
  if (score >= 60) return { label: "Fair", color: "text-amber-400" };
  return { label: "Needs Improvement", color: "text-rose-400" };
}

export function Result() {
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
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-accent/10">
            <Loader className="size-8 animate-spin text-accent" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Loading Results</h2>
          <p className="mt-2 text-muted-foreground">Fetching your interview results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-destructive/10">
            <CircleAlert className="size-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
          <p className="mt-2 mb-6 text-muted-foreground">{error ?? "Result not found"}</p>
          <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const { averageScore, questions } = result;
  const grade = getGrade(averageScore);
  const answeredCount = questions.filter((q) => q.answer !== null).length;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 py-4">
      {/* Header */}
      <div className="mb-8 animate-fade-in-down text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-3xl bg-accent/10">
          <Trophy className="size-8 text-accent" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Interview Complete</h2>
        <p className="mt-1 text-muted-foreground">
          {answeredCount} of {questions.length} questions answered
        </p>
      </div>

      {/* Score overview */}
      <div className="animate-fade-in-scale mb-8 flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-card/40 p-8 backdrop-blur-xl shadow-[0_0_60px_-20px_oklch(0.6_0.25_280/0.08)]">
        <ScoreRing score={averageScore} size={140} />
        <div className="text-center">
          <p className={cn("text-lg font-semibold", grade.color)}>{grade.label}</p>
          <p className="text-sm text-muted-foreground">Overall Score</p>
        </div>
      </div>

      {/* Question cards */}
      <div className="space-y-4">
        {questions.map((q, i) => {
          const category = getCategoryConfig(q.category);
          const qGrade = getGrade(q.score);

          return (
            <div
              key={i}
              className="animate-fade-in-up rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl shadow-[0_0_40px_-12px_oklch(0.6_0.25_280/0.06)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Question header */}
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
                  <div className="flex shrink-0 flex-col items-center">
                    <span className={cn("text-2xl font-bold", getScoreColor(q.score))}>
                      {q.score}
                    </span>
                    <span className={cn("text-xs font-medium", qGrade.color)}>{qGrade.label}</span>
                  </div>
                )}
              </div>

              {/* Answer */}
              {q.answer ? (
                <div className="mb-3 space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Check className="size-3.5" />
                    Your Answer
                  </p>
                  <p className="rounded-lg bg-secondary/30 px-3 py-2 text-sm leading-relaxed text-foreground/80">
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

              {/* Feedback */}
              {q.feedback && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Sparkles className="size-3.5" />
                    Feedback
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/70">{q.feedback}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
          <ArrowLeft className="size-4" />
          New Interview
        </Button>
      </div>
    </div>
  );
}