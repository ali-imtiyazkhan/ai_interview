import { useState, useRef, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeUpload } from "./ResumeUpload";
import { Button } from "@/components/ui/shared";
import { SectionLabel, InputWithIcon, Chip, Segmented, ProgressSteps, FormCard, inputClass, iconWrapClass } from "@/components/ui/shared";
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
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-accent/15 via-transparent to-transparent blur-2xl" />

      <FormCard loading={loading} progressBar progressValue={loading ? ((currentStep + 1) / 3) * 100 : 0}>
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
              <InputWithIcon
                icon={Code}
                iconClassName={cn(
                  iconWrapClass,
                  "size-4 transition-colors",
                  github ? "text-accent" : "text-muted-foreground/40",
                )}
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className={cn(inputClass, shake && !github.trim() && "animate-shake border-red-500/40")}
                disabled={loading}
                aria-label="GitHub profile URL"
              />
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/50">
                <ShieldCheck className="size-3.5 text-emerald-400/70" />
                Public repos & READMEs are analyzed locally to craft your questions.
              </p>
            </div>

            {/* Section 02 — About you */}
            {!loading && (
              <div>
                <SectionLabel index="02">About You</SectionLabel>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <InputWithIcon
                      icon={User}
                      id="candidateName"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                      aria-label="Your name"
                    />
                    <InputWithIcon
                      icon={Briefcase}
                      id="jobRole"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      placeholder="Target role"
                      className={inputClass}
                      aria-label="Target role"
                    />
                  </div>

                  <div className="relative">
                    <Clock className={cn(iconWrapClass, "size-4 text-muted-foreground/40")} />
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
              variant="gradient"
              size="pill"
              disabled={loading}
              loading={loading}
              loadingText="Processing..."
              className="group relative h-12 w-full overflow-hidden rounded-xl text-sm font-semibold text-foreground"
            >
              <span className="relative flex items-center gap-2">
                <Wand2 className="size-4" />
                Generate My Interview
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
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
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 animate-fade-in-up">
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
              className="w-full text-center text-xs font-medium text-muted-foreground/50 transition-colors hover:text-foreground/70 focus-ring rounded"
            >
              Skip — start interview now
            </button>
          </div>
        )}

        <ProgressSteps steps={steps} currentStep={currentStep} loading={loading} />
      </FormCard>
    </div>
  );
}