import { useState, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
import { Code, UserRound, ArrowRight, Check, Loader, CircleAlert, FileText, Briefcase, User, Layers } from "lucide-react";

type StepId = "create" | "github-embed" | "linkedin-embed" | "done";

interface Step {
  id: StepId;
  label: string;
}

const steps: Step[] = [
  { id: "create", label: "Creating your interview session..." },
  { id: "github-embed", label: "Fetching & embedding GitHub repositories..." },
  { id: "linkedin-embed", label: "Embedding LinkedIn profile..." },
];

export function Form() {
  const navigate = useNavigate();
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [linkedinText, setLinkedinText] = useState("");
  const [showLinkedinInput, setShowLinkedinInput] = useState(false);
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

    if (!github.trim() || !linkedin.trim()) {
      triggerShake();
      toast.error("Please enter both GitHub and LinkedIn URLs", {
        icon: <CircleAlert className="size-4" />,
      });
      return;
    }

    try {
      new URL(github);
      new URL(linkedin);
    } catch {
      triggerShake();
      toast.error("Please enter valid URLs", {
        icon: <CircleAlert className="size-4" />,
      });
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    try {
      //  Create interview session
      setCurrentStep(0);
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
        github,
        linkedin,
        candidateName: candidateName || undefined,
        jobRole: jobRole || undefined,
        experienceLevel: experienceLevel || undefined,
      });
      const interviewId: string = data.id;

      //  Embed GitHub data
      setCurrentStep(1);
      await axios.post(`${BACKEND_URL}/api/v1/pre-interview/embed-github`, {
        interviewId,
        githubUrl: github,
      });

      //  Embed LinkedIn data
      setCurrentStep(2);
      try {
        await axios.post(`${BACKEND_URL}/api/v1/pre-interview/embed-linkedin`, {
          interviewId,
          linkedinUrl: linkedin,
          profileText: linkedinText || undefined,
        });
      } catch {
        // LinkedIn embedding may fail if no data provided — non-blocking
      }

      setCurrentStep(3);
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
          "w-full max-w-md rounded-2xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl transition-all duration-300",
          "shadow-[0_0_40px_-12px_oklch(0.6_0.25_280/0.15)]",
          loading && "pointer-events-none opacity-80",
        )}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-accent/10">
            {loading ? (
              <Loader className="size-6 animate-spin text-accent" />
            ) : (
              <div className="relative">
                <div className="absolute -inset-2 animate-pulse-ring rounded-full" />
                <span className="text-2xl">⚡</span>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            {loading ? "Setting up your interview" : "Start Your Interview"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Please wait while we gather your data"
              : "Connect your profiles to get started"}
          </p>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              GitHub Profile
            </label>
            <div className="relative">
              <Code
                className={cn(
                  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors",
                  github ? "text-foreground" : "text-muted-foreground",
                )}
              />
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className={cn("pl-9", shake && !github.trim() && "animate-shake border-destructive/50")}
                disabled={loading}
              />
            </div>
          </div>

          {!loading && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Your Name
                </label>
                <div className="relative">
                  <User
                    className={cn(
                      "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors",
                      candidateName ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <Input
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Target Role
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="e.g. Senior Frontend"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Experience
                  </label>
                  <div className="relative">
                    <Layers
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      placeholder="e.g. 5 years"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              LinkedIn Profile
            </label>
            <div className="relative">
              <UserRound
                className={cn(
                  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors",
                  linkedin ? "text-foreground" : "text-muted-foreground",
                )}
              />
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className={cn("pl-9", shake && !linkedin.trim() && "animate-shake border-destructive/50")}
                disabled={loading}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowLinkedinInput(!showLinkedinInput)}
              className="text-xs text-muted-foreground hover:text-accent transition-colors mt-1"
            >
              {showLinkedinInput ? "Hide manual input" : "LinkedIn scraping unavailable — paste your profile instead?"}
            </button>
            {showLinkedinInput && (
              <div className="mt-2 space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <FileText className="size-3.5" />
                  Your LinkedIn Profile (paste your headline, skills, experience, education)
                </label>
                <Textarea
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                  placeholder="Senior Software Engineer at Acme Corp&#10;Skills: TypeScript, React, Node.js, Python&#10;&#10;Experience:&#10;  - Lead Engineer at Acme Corp (2020-Present)&#10;    Architected microservices handling 1M+ requests/day&#10;  - Full Stack Developer at Beta Inc (2018-2020)&#10;    Built real-time collaboration features&#10;&#10;Education:&#10;  - B.S. Computer Science, University of Example (2014-2018)"
                  className="min-h-[140px] resize-none text-sm"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="relative mt-2 h-11 w-full overflow-hidden rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-accent/25"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="size-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Start Interview
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </Button>
        </form>

        {loading && (
          <div className="mt-8 space-y-3 border-t border-border/30 pt-6">
            {steps.map((step, i) => {
              const status = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-all duration-500",
                      status === "done" &&
                      "border-emerald-500/50 bg-emerald-500/20 text-emerald-400",
                      status === "active" &&
                      "border-accent/50 bg-accent/10 text-accent",
                      status === "pending" &&
                      "border-border/30 text-muted-foreground/40",
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
                      status === "active" && "text-foreground",
                      status === "pending" && "text-muted-foreground/40",
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
