import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Textarea } from "../components/ui/textarea";
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
  AudioLines,
  Binary,
  Volume2,
  Ear,
} from "lucide-react";
import {
  getSpeechRecognition,
  isSpeechSynthesisSupported,
  ensureVoices,
  speakText,
  stopSpeaking,
  type SpeechRecognitionLike,
} from "@/lib/speech";

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
  DSA: { label: "DSA Problem", icon: Binary, color: "from-fuchsia-500/20 to-fuchsia-600/10 text-fuchsia-400 border-fuchsia-500/30" },
};

function getCategoryConfig(category: string) {
  return categoryConfig[category] ?? { label: category, icon: BrainCircuit, color: "from-neutral-500/20 to-neutral-600/10 text-neutral-400 border-neutral-500/30" };
}

function WaveformBars({ isRecording }: { isRecording: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full bg-rose-500/70 transition-all",
            isRecording ? "animate-wave" : "opacity-30",
          )}
          style={{
            height: isRecording ? `${40 + Math.sin(i * 1.5) * 30 + Math.random() * 20}%` : "30%",
            animationDelay: `${i * 100}ms`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export function InterviewPage() {
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
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const [isDictating, setIsDictating] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const category = currentQuestion ? getCategoryConfig(currentQuestion.category) : null;

  useEffect(() => {
    if (!id) return;

    async function startInterview() {
      try {
        const { data } = await axios.post<{
          questions: Question[];
          answeredQuestionIds?: string[];
        }>(`${BACKEND_URL}/api/v1/interview/${id}/start`);

        const answeredIds = new Set(data.answeredQuestionIds ?? []);
        setQuestions(data.questions);

        if (data.questions.length === 0) {
          toast.error("No questions were generated", {
            icon: <CircleAlert className="size-4" />,
          });
          navigate("/");
          return;
        }

        if (answeredIds.size >= data.questions.length) {
          navigate(`/result?id=${id}`);
          return;
        }

        const resumeIndex = data.questions.findIndex((q) => !answeredIds.has(q.id));
        if (resumeIndex > 0) {
          setCurrentIndex(resumeIndex);
        }

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

  useEffect(() => {
    if (isSpeechSynthesisSupported()) {
      ensureVoices();
    }
  }, []);

  useEffect(() => {
    if (loading || starting || !currentQuestion) return;

    if (autoRead && !isDictating) {
      speakText(currentQuestion.question, () => setIsSpeaking(false));
      setIsSpeaking(true);
    } else {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [currentQuestion?.id, loading, starting]);

  async function handleSubmit() {
    if (!answer.trim() && !audioBlob) {
      toast.error("Please provide an answer (text or audio)", {
        icon: <CircleAlert className="size-4" />,
      });
      return;
    }

    if (!currentQuestion || !id) return;

    if (isDictating) {
      stopDictation();
    }
    stopSpeaking();
    setIsSpeaking(false);
    setAutoRead(false);
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

  function handleSkip() {
    if (!currentQuestion || !id) return;

    if (isDictating) {
      stopDictation();
    }
    stopSpeaking();
    setIsSpeaking(false);
    setAutoRead(false);

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((i) => i + 1);
      setAnswer("");
      setAudioBlob(null);
      setRecordingTime(0);
      toast.info("Question skipped", {
        icon: <ArrowRight className="size-4" />,
      });
    } else {
      setCompleted(true);
      toast.success("Interview complete!", {
        icon: <Sparkles className="size-4" />,
      });
      setTimeout(() => navigate(`/result?id=${id}`), 800);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicError(null);

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/wav",
      ];
      const mimeType = supportedTypes.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
        setAudioBlob(blob);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setAudioBlob(null);
      setRecordingTime(0);

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

  function toggleSpeech() {
    if (!currentQuestion) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setAutoRead(false);
    } else {
      speakText(currentQuestion.question, () => setIsSpeaking(false));
      setIsSpeaking(true);
      setAutoRead(true);
    }
  }

  function startDictation() {
    const Constructor = getSpeechRecognition();
    if (!Constructor) {
      setMicError("Voice input is not supported in this browser. Try Chrome or Edge.");
      toast.error("Voice input is not supported in this browser", {
        icon: <CircleAlert className="size-4" />,
      });
      return;
    }

    const recognition = new Constructor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const alt = result?.[0];
        if (!alt) continue;
        if (result.isFinal) {
          finalText += alt.transcript;
        } else {
          interim += alt.transcript;
        }
      }
      if (finalText.trim()) {
        setAnswer((prev) => (prev.trim() ? `${prev.trim()} ${finalText.trim()}` : finalText.trim()));
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsDictating(false);
        setMicError("Microphone access denied. Please allow microphone access.");
        toast.error("Microphone access denied", {
          icon: <CircleAlert className="size-4" />,
        });
      } else if (event.error === "audio-capture") {
        setIsDictating(false);
        setMicError("No microphone detected.");
        toast.error("No microphone detected", {
          icon: <CircleAlert className="size-4" />,
        });
      }
    };

    recognition.onend = () => {
      setIsDictating(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setMicError(null);
    setIsDictating(true);
  }

  function stopDictation() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsDictating(false);
    setInterimTranscript("");
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      stopSpeaking();
    };
  }, []);

  if (starting) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 px-16 py-14 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="liquid-glass pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
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
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-fade-in-scale relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 px-16 py-14 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="liquid-glass pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
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
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-4">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-accent/10 text-xs font-semibold text-accent">
              {currentIndex + 1}
            </span>
            <span>of {totalQuestions} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground/60">Progress</span>
            <span className="font-semibold text-accent">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent via-fuchsia-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        ref={questionRef}
        key={currentQuestion?.id ?? currentIndex}
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          direction === "next" ? "animate-fade-in-up" : "animate-fade-in-scale",
        )}
      >
        <div className="group relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/40 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-300 hover:border-white/20">
          <div className="liquid-glass pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative">
            {category && (
              <div className="mb-5 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-b px-3 py-1 text-xs font-medium",
                    category.color,
                  )}
                >
                  <category.icon className="size-3.5" />
                  {category.label}
                </span>
                <button
                  type="button"
                  onClick={toggleSpeech}
                  title={isSpeaking ? "Stop reading question" : "Read question aloud"}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    isSpeaking
                      ? "border-accent/40 bg-accent/15 text-accent shadow-[0_0_20px_-4px_oklch(0.6_0.25_280/0.4)]"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:border-accent/30 hover:text-accent",
                  )}
                >
                  {isSpeaking ? <Square className="size-3.5" /> : <Volume2 className="size-3.5" />}
                  {isSpeaking ? "Reading..." : "Listen"}
                </button>
              </div>
            )}

            <h3 className="text-xl leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed">
              {currentQuestion?.question}
            </h3>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <BrainCircuit className="size-4 text-muted-foreground/40" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="flex-1 space-y-3">
              <label htmlFor="answer" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AudioLines className="size-3.5" />
                Your Answer
              </label>

              <div className="flex items-center gap-2 flex-wrap">
                {!isRecording && !audioBlob && !isDictating && (
                  <>
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={submitting}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-accent/30 hover:bg-accent/10 hover:text-accent disabled:opacity-50"
                    >
                      <Mic className="size-3.5" />
                      Record Audio
                    </button>
                    <button
                      type="button"
                      onClick={startDictation}
                      disabled={submitting}
                      className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-all hover:bg-accent/20 disabled:opacity-50"
                    >
                      <Ear className="size-3.5" />
                      Answer by Voice
                    </button>
                  </>
                )}

                {isDictating && (
                  <div className="flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/[0.1] px-3 py-2 animate-expand-in shadow-[0_0_30px_-8px_oklch(0.6_0.25_280/0.5)]">
                    <WaveformBars isRecording={true} />
                    <span className="text-xs font-medium text-accent">Listening...</span>
                    <div className="h-4 w-px bg-accent/20" />
                    <button
                      type="button"
                      onClick={stopDictation}
                      className="flex items-center gap-1.5 rounded-lg bg-accent/20 px-2.5 py-1.5 text-xs font-medium text-accent transition-all hover:bg-accent/30"
                    >
                      <Square className="size-3" />
                      Stop
                    </button>
                  </div>
                )}

                {isRecording && (
                  <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/[0.08] px-3 py-2 animate-expand-in">
                    <WaveformBars isRecording={true} />
                    <span className="text-xs font-medium text-rose-400 tabular-nums">
                      {formatTime(recordingTime)}
                    </span>
                    <div className="h-4 w-px bg-rose-500/20" />
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-2.5 py-1.5 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/30"
                    >
                      <Square className="size-3" />
                      Stop
                    </button>
                  </div>
                )}

                {audioBlob && !isRecording && (
                  <div className="flex items-center gap-2 animate-expand-in">
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
                      className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-destructive/20 hover:text-destructive"
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
                id="answer"
                value={isDictating ? `${answer}${interimTranscript ? ` ${interimTranscript}` : ""}` : answer}
                readOnly={isDictating}
                onChange={(e) => {
                  if (!isDictating) setAnswer(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  isDictating
                    ? "Speak your answer now..."
                    : audioBlob
                      ? "Add a text note (optional)..."
                      : "Type your answer here... (Cmd+Enter to submit)"
                }
                className="min-h-[120px] resize-none border-white/10 bg-white/5 text-base leading-relaxed backdrop-blur-sm transition-all duration-200 focus:min-h-[160px] focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground/60">
                {isDictating ? (
                  "Speaking... your words appear here in real time."
                ) : (
                  <>
                    Press{" "}
                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">Cmd</kbd>{" "}
                    +{" "}
                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">Enter</kbd>{" "}
                    to submit
                  </>
                )}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || isDictating || (!answer.trim() && !audioBlob)}
                className="group relative h-11 flex-1 overflow-hidden rounded-xl text-sm font-semibold text-foreground transition-all duration-300 disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent/90 via-fuchsia-500/80 to-accent/90 bg-[length:200%_100%] opacity-90 transition-all duration-500 group-hover:animate-gradient-shift group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-2">
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
                </span>
              </button>

              <button
                type="button"
                onClick={handleSkip}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground disabled:opacity-50"
              >
                Skip
                <ArrowRight className="size-3.5" />
              </button>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                <Clock className="size-3.5" />
                <span>{totalQuestions - currentIndex - 1} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
