import { useState, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
import { Code, ArrowRight, Check, Loader, CircleAlert, Briefcase, User, Layers, Sparkles } from "lucide-react";

type StepId = "create" | "github-embed" | "done";

interface Step {
  id: StepId;
  label: string;
}

const steps: Step[] = [
  { id: "create", label: "Creating your interview session..." },
  { id: "github-embed", label: "Fetching & embedding GitHub repositories..." },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm transition-all duration-300 outline-none focus:border-white/20 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/10";

const labelClass = "block text-xs font-medium text-muted-foreground/80 mb-1.5 tracking-wide uppercase";

const iconWrapClass = "pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2";

export function Form() {
  const navigate = useNavigate();
  const [github, setGithub] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
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

      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 400));

      toast.success("Interview ready!", {
        icon: <Check className="size-4" />,
      });
      navigate(`/interview/${interviewId}`);
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
    <div className="flex flex-1 items-center justify-center">
      <div
        className={cn(
          "group relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-background/30 p-8 backdrop-blur-xl transition-all duration-500",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          loading && "pointer-events-none opacity-80",
        )}
      >
        {/* subtle glow */}
        <div className="pointer-events-none absolute -inset-40 -top-60 left-1/2 -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />

        <div className="relative mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            {loading ? (
              <Loader className="size-5 animate-spin text-foreground" />
            ) : (
              <Sparkles className="size-5 text-foreground" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-foreground/90">
            {loading ? "Setting up your interview" : "Start Your Interview"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {loading
              ? "Please wait while we gather your data"
              : "Connect your profile to get started"}
          </p>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="relative space-y-4">
          <div>
            <label htmlFor="github" className={labelClass}>
              GitHub Profile
            </label>
            <div className="relative">
              <Code
                className={cn(
                  iconWrapClass,
                  "size-4 transition-colors",
                  github ? "text-foreground/70" : "text-muted-foreground/40",
                )}
              />
              <input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className={cn(inputClass, shake && !github.trim() && "border-red-500/40")}
                disabled={loading}
              />
            </div>
          </div>

          {!loading && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="candidateName" className={labelClass}>
                  Your Name
                </label>
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
                    placeholder="Jane Doe"
                    className={cn(inputClass, "pl-10")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jobRole" className={labelClass}>
                  Target Role
                </label>
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
                    placeholder="e.g. Senior Frontend"
                    className={cn(inputClass, "pl-10")}
                  />
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <div>
              <label htmlFor="experienceLevel" className={labelClass}>
                Experience
              </label>
              <div className="relative">
                <Layers
                  className={cn(
                    iconWrapClass,
                    "size-4 text-muted-foreground/40",
                  )}
                />
                <input
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="e.g. 5 years"
                  className={cn(inputClass, "pl-10")}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="glass"
            size="pill"
            disabled={loading}
            className="relative mt-4 h-11 w-full rounded-xl px-6 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-[1.01]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="size-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Start Interview
                <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>

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
                      status === "active" && "border-white/20 bg-white/10 text-foreground",
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
