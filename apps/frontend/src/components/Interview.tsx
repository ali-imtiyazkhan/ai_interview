import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
import {
  ArrowRight,
  Check,
  Loader,
  CircleAlert,
  Sparkles,
  Send,
  BrainCircuit,
  Code,
  Users,
  Lightbulb,
  Layers,
  Terminal,
  Clock,
  Mic,
  Square,
  Play,
  Trash2,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  order: number;
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

export function Interview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const category = currentQuestion ? getCategoryConfig(currentQuestion.category) : null;

  useEffect(() => {
    if (!id) return;

    async function startInterview() {
      try {
        const { data } = await axios.post(`${BACKEND_URL}/api/v1/interview/${id}/start`);
        setQuestions(data.questions);
        setStarting(false);
        setLoading(false);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Failed to start interview"
          : "Something went wrong";
        toast.error(message, {
          icon: <CircleAlert className="size-4" />,
        });
        navigate("/");
      }
    }

    startInterview();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && !starting && answerRef.current) {
      answerRef.current.focus();
    }
  }, [currentIndex, loading, starting]);

  async function handleSubmit() {
    if (!answer.trim() && !audioBlob) {
      toast.error("Please provide an answer (text or audio)", {
        icon: <CircleAlert className="size-4" />,
      });
      return;
    }

    if (!currentQuestion || !id) return;

    setSubmitting(true);

    let audioUrl: string | undefined;
    if (audioBlob) {
      audioUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
    }

    try {
      await axios.post(`${BACKEND_URL}/api/v1/interview/${id}/answer`, {
        questionId: currentQuestion.id,
        transcript: answer,
        audioUrl,
      });

      if (currentIndex + 1 < totalQuestions) {
        setDirection("next");
        setCurrentIndex((i) => i + 1);
        setAnswer("");
        setAudioBlob(null);
        setRecordingTime(0);
        toast.success("Answer submitted!", {
          icon: <Check className="size-4" />,
        });
      } else {
        setCompleted(true);
        toast.success("Interview complete! Viewing results...", {
          icon: <Sparkles className="size-4" />,
        });
        setTimeout(() => navigate(`/result?id=${id}`), 800);
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Failed to submit answer"
        : "Something went wrong";
      toast.error(message, {
        icon: <CircleAlert className="size-4" />,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicError(null);

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordingTime(0);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setAudioBlob(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setMicError("Microphone access denied. Please type your answer instead.");
      toast.error("Microphone access denied", {
        icon: <CircleAlert className="size-4" />,
      });
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function clearAudio() {
    setAudioBlob(null);
    setRecordingTime(0);
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Starting screen
  if (starting) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-accent/10">
            <div className="relative">
              <div className="absolute -inset-4 animate-pulse-ring rounded-full" />
              <Sparkles className="size-8 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Preparing Your Interview</h2>
          <p className="mt-2 text-muted-foreground">Generating personalized questions based on your profile...</p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-2 animate-bounce rounded-full bg-accent/60"
                style={{ animationDelay: `${i * 150}ms`, animationDuration: "1.2s" }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Completed screen
  if (completed) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-fade-in-scale text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-emerald-500/10">
            <div className="relative">
              <div className="absolute -inset-4 animate-pulse-ring rounded-full border-emerald-500/30" />
              <Check className="size-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Interview Complete!</h2>
          <p className="mt-2 text-muted-foreground">Redirecting to your results...</p>
          <div className="mt-8">
            <Loader className="mx-auto size-5 animate-spin text-accent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-4">
      {/* Progress bar */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-accent/10 text-xs font-medium text-accent">
              {currentIndex + 1}
            </span>
            <span>of {totalQuestions} questions</span>
          </div>
          <span className="font-medium text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent/60 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        ref={questionRef}
        key={currentQuestion?.id ?? currentIndex}
        className="animate-fade-in-up flex flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col rounded-2xl border border-border/50 bg-card/40 p-8 backdrop-blur-xl shadow-[0_0_60px_-20px_oklch(0.6_0.25_280/0.08)]">
          {/* Category badge */}
          {category && (
            <div className="mb-5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-b px-3 py-1 text-xs font-medium",
                  category.color,
                )}
              >
                <category.icon className="size-3.5" />
                {category.label}
              </span>
            </div>
          )}

          {/* Question text */}
          <h3 className="text-xl leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed">
            {currentQuestion?.question}
          </h3>

          {/* Decorative divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            <BrainCircuit className="size-4 text-muted-foreground/40" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          </div>

          {/* Answer area */}
          <div className="flex-1 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mic className="size-3.5" />
              Your Answer
            </label>

            {/* Audio recording controls */}
            <div className="flex items-center gap-2">
              {!isRecording && !audioBlob && (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-accent/10 hover:text-accent disabled:opacity-50"
                >
                  <Mic className="size-3.5" />
                  Record Audio
                </button>
              )}

              {isRecording && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="size-2 animate-pulse rounded-full bg-rose-500" />
                    <span className="text-xs font-medium text-rose-400">
                      Recording {formatTime(recordingTime)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-2 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/30"
                  >
                    <Square className="size-3.5" />
                    Stop
                  </button>
                </div>
              )}

              {audioBlob && !isRecording && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => audioRef.current?.play()}
                    className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-all hover:bg-accent/20"
                  >
                    <Play className="size-3.5" />
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={clearAudio}
                    className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Discard
                  </button>
                  <span className="text-xs text-muted-foreground/60">
                    Audio recorded ({formatTime(recordingTime)})
                  </span>
                  <audio ref={audioRef} src={audioBlob ? URL.createObjectURL(audioBlob) : undefined} />
                </div>
              )}

              {micError && (
                <span className="text-xs text-rose-400">{micError}</span>
              )}
            </div>

            <Textarea
              ref={answerRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={audioBlob ? "Add a text note (optional)..." : "Type your answer here... (Cmd+Enter to submit)"}
              className="min-h-[120px] resize-none text-base leading-relaxed transition-all duration-200 focus:min-h-[160px]"
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground/60">
              Press <kbd className="rounded border border-border/30 bg-secondary/50 px-1.5 py-0.5 text-[10px]">Cmd</kbd> + <kbd className="rounded border border-border/30 bg-secondary/50 px-1.5 py-0.5 text-[10px]">Enter</kbd> to submit
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={submitting || (!answer.trim() && !audioBlob)}
              className="relative h-11 flex-1 overflow-hidden rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-accent/25"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader className="size-4 animate-spin" />
                  Evaluating...
                </span>
              ) : currentIndex + 1 < totalQuestions ? (
                <span className="flex items-center gap-2">
                  Submit & Next
                  <ArrowRight className="size-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="size-4" />
                  Submit & Finish
                </span>
              )}
            </Button>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
              <Clock className="size-3.5" />
              <span>{totalQuestions - currentIndex - 1} remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
