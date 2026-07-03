import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/lib/config";
import { FileText, Upload, Check, Loader, CircleAlert, X, Sparkles, ScrollText } from "lucide-react";

interface ResumeUploadProps {
  interviewId: string;
  onComplete: (skills: string[], projects: { name: string; description: string; technologies: string[] }[]) => void;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm transition-all duration-300 outline-none focus:border-white/20 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/10";

export function ResumeUpload({ interviewId, onComplete }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!file) {
      toast.error("Please select a resume file", { icon: <CircleAlert className="size-4" /> });
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("interviewId", interviewId);

      const { data } = await axios.post<{ skills: string[]; projects: { name: string; description: string; technologies: string[] }[] }>(
        `${BACKEND_URL}/api/v1/resume/upload`,
        formData,
      );

      setUploaded(true);
      toast.success("Resume processed!", { icon: <Check className="size-4" /> });
      onComplete(data.skills, data.projects);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Failed to upload resume"
        : "Something went wrong";
      setError(message);
      toast.error(message, { icon: <CircleAlert className="size-4" /> });
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please upload a PDF, DOCX, or TXT file");
    }
  }

  function isValidFileType(f: File) {
    const valid = [".pdf", ".docx", ".txt"];
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    return valid.includes(ext);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <Card className="w-full max-w-lg mx-auto border-white/10 bg-background/30 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          {uploaded ? (
            <Check className="size-5 text-emerald-400" />
          ) : (
            <ScrollText className="size-5 text-foreground/70" />
          )}
        </div>
        <CardTitle className="text-lg font-semibold text-foreground/90">
          {uploaded ? "Resume Uploaded" : "Upload Resume"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground/70">
          {uploaded
            ? "Your resume has been analyzed — skills and projects extracted"
            : "Upload your resume to get personalized interview questions"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!uploaded ? (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-300",
                dragOver
                  ? "border-accent/60 bg-accent/5"
                  : file
                    ? "border-white/20 bg-white/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    if (isValidFileType(f)) {
                      setFile(f);
                      setError("");
                    } else {
                      setError("Please upload a PDF, DOCX, or TXT file");
                    }
                  }
                }}
              />

              {file ? (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                    <FileText className="size-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground/80">{file.name}</p>
                    <p className="text-xs text-muted-foreground/50">{formatSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="ml-2 rounded-full p-1 text-muted-foreground/40 transition-colors hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Upload className="size-5 text-muted-foreground/60" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground/70">
                      <span className="font-medium text-foreground/70">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/40">PDF, DOCX or TXT (max 5MB)</p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                <CircleAlert className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              variant="glass"
              size="pill"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="h-11 w-full rounded-xl text-sm font-semibold"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <Loader className="size-4 animate-spin" />
                  Extracting skills & projects...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Analyze Resume
                </span>
              )}
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <Check className="size-4" />
              Resume processed successfully
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUploaded(false);
                setFile(null);
                setError("");
              }}
              className="text-xs"
            >
              Upload another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
