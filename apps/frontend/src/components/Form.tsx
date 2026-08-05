import { useState, useRef, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeUpload } from "./ResumeUpload";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
import {
  Code,
  ArrowRight,
  Check,
  Loader,
  CircleAlert,
  Briefcase,
  User,
  Sparkles,
  ShieldCheck,
  Wand2,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type StepId = "create" | "github-embed" | "done";

interface Step {
  id: StepId;
  label: string;
}

const steps: Step[] = [
  { id: "create", label: "Creating your interview session..." },
  { id: "github-embed", label: "Fetching & embedding GitHub repositories..." },
];

const experienceOptions = ["0-2 years", "3-5 years", "6-10 years", "10+ years"];

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

export function Form() {
  const navigate = useNavigate();
  const [github, setGithub] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [showResumestep, setShowResumestep] = useState(false);
  const [shake, setShake] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!github.trim()) {
      triggerShake();
      toast.error("Please enter your GitHub URL", {
        icon: <CircleAlert className="size-4" />,
      });
      return;
    }

    try {
      new URL(github);
    } catch {
      triggerShake();
      toast.error("Please enter a valid URL", {
        icon: <CircleAlert className="size-4" />,
      });
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    try {
      setCurrentStep(0);
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
        github,
        candidateName: candidateName || undefined,
        jobRole: jobRole || undefined,
        experienceLevel: experienceLevel || undefined,
      });
      const interviewId: string = data.id;

      setCurrentStep(1);
      await axios.post(`${BACKEND_URL}/api/v1/pre-interview/embed-github`, {
        interviewId,
        githubUrl: github,
      });

      setInterviewId(interviewId);
      setCurrentStep(2);
      setLoading(false);
      setShowResumestep(true);
    } catch (error) {
      setLoading(false);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Failed to connect to server"
        : "Something went wrong";
      toast.error(message, {
        icon: <CircleAlert className="size-4" />,
      });
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* ambient glow behind the card */}
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-accent/15 via-transparent to-transparent blur-2xl" />

      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-500",
          loading && "pointer-events-none",
        )}
      >
        {/* progress bar */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-accent via-fuchsia-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: loading ? `${((currentStep + 1) / 3) * 100}%` : "0%" }}
          />
        </div>

        {/* liquid-glass border */}
        <div className="liquid-glass pointer-events-none absolute inset-0 opacity-60" />

        {/* header */}
        <div className="relative mb-8 text-center">
          <div
            className={cn(
              "mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-white/10",
              loading
                ? "bg-white/5"
                : "animate-glow bg-gradient-to-br from-accent/20 to-fuchsia-500/10",
            )}
          >
            {loading ? (
              <Loader className="size-6 animate-spin text-accent" />
            ) : (
              <Sparkles className="size-6 text-accent" />
            )}
          </div>

          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {loading ? "Setting up your interview" : "Start Your Interview"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground/70">
            {loading
              ? "Please wait while we gather your data"
              : "Connect your profile — it takes less than a minute"}
          </p>
        </div>

        {!showResumestep && (
          <form ref={formRef} onSubmit={onSubmit} className="relative space-y-7">
            {/* Section 01 — GitHub */}
            <div>
              <SectionLabel index="01">GitHub Profile</SectionLabel>
              <div className="relative">
                <Code
                  className={cn(
                    iconWrapClass,
                    "size-4 transition-colors",
                    github ? "text-accent" : "text-muted-foreground/40",
                  )}
                />
                <input
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className={cn(
                    inputClass,
                    shake && !github.trim() && "animate-shake border-red-500/40",
                  )}
                  disabled={loading}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/50">
                <ShieldCheck className="size-3.5 text-emerald-400/70" />
                Public repos &amp; READMEs are analyzed locally to craft your questions.
              </p>
            </div>

            {/* Section 02 — About you */}
            {!loading && (
              <div>
                <SectionLabel index="02">About You</SectionLabel>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User
                        className={cn(
                          iconWrapClass,
                          "size-4 text-muted-foreground/40",
                        )}
                      />
                      <input
                        id="candidateName"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>

                    <div className="relative">
                      <Briefcase
                        className={cn(
                          iconWrapClass,
                          "size-4 text-muted-foreground/40",
                        )}
                      />
                      <input
                        id="jobRole"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        placeholder="Target role"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Clock
                      className={cn(
                        iconWrapClass,
                        "size-4 text-muted-foreground/40",
                      )}
                    />
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger
                        className={cn(
                          "h-[42px] w-full rounded-xl border-white/10 bg-white/5 px-11 text-sm text-foreground backdrop-blur-sm outline-none transition-all duration-300 hover:border-white/20 focus:border-accent/50 focus:ring-4 focus:ring-accent/10",
                          !experienceLevel && "text-muted-foreground/40",
                        )}
                      >
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#161616] text-foreground">
                        {experienceOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

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
                    Generate My Interview
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/50">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                No sign-up
              </span>
              <span className="size-1 rounded-full bg-white/10" />
              <span className="flex items-center gap-1">
                <Sparkles className="size-3.5" />
                Free
              </span>
              <span className="size-1 rounded-full bg-white/10" />
              <span className="flex items-center gap-1">
                <Code className="size-3.5" />
                Runs locally
              </span>
            </div>
          </form>
        )}

        {showResumestep && interviewId && (
          <div className="relative space-y-5">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <Check className="size-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-300">Interview ready!</p>
                <p className="text-xs text-emerald-200/60">
                  Your GitHub profile has been embedded. Optionally upload your resume:
                </p>
              </div>
            </div>

            <ResumeUpload
              interviewId={interviewId}
              onComplete={() => navigate(`/interview/${interviewId}`)}
            />

            <button
              type="button"
              onClick={() => navigate(`/interview/${interviewId}`)}
              className="w-full text-center text-xs font-medium text-muted-foreground/50 transition-colors hover:text-foreground/70"
            >
              Skip — start interview now
            </button>
          </div>
        )}

        {loading && (
          <div className="relative mt-8 space-y-3 border-t border-white/10 pt-6">
            {steps.map((step, i) => {
              const status = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
              return (
                <div key={step.id} className="flex items-center gap-3">
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
  );
}
