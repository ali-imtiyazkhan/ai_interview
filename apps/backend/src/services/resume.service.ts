import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchRepoReadme, fetchRepoLanguages, truncateReadme } from "./github.service";
import { generateEmbedding, chunkText } from "./embeddings.service";
import { prisma } from "../config/db";
import { env } from "../config/env";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ExtractedResume {
    skills: string[];
    experience: { title: string; company: string; duration: string; description: string }[];
    education: { school: string; degree: string; field: string; year: string }[];
    projects: { name: string; description: string; technologies: string[] }[];
    summary: string;
}

const GITHUB_REPO_REGEX = /https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\/|$|[\s,;)]|\.(?:git|png|jpg|svg))?/g;

function extractGitHubUrls(text: string): { owner: string; repo: string }[] {
    const urls: { owner: string; repo: string }[] = [];
    const seen = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = GITHUB_REPO_REGEX.exec(text)) !== null) {
        const owner = match[1]!;
        const repo = match[2]!;
        const key = `${owner}/${repo}`.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            urls.push({ owner, repo });
        }
    }
    return urls;
}

export async function embedResumeRepos(interviewId: string, projects: { name: string; description: string; technologies: string[] }[]): Promise<{ repo: string; embedded: boolean }[]> {
    const results: { repo: string; embedded: boolean }[] = [];

    const allText = projects.map(p => `${p.name}: ${p.description} ${p.technologies.join(", ")}`).join("\n");
    const repoRefs = extractGitHubUrls(allText).slice(0, env.githubMaxRepos ?? 4);

    for (const { owner, repo } of repoRefs) {
        try {
            const readme = await fetchRepoReadme(owner, repo);
            const languages = await fetchRepoLanguages(owner, repo);

            const contextParts: string[] = [`GitHub repository: ${owner}/${repo}`];

            if (readme) {
                const truncated = truncateReadme(readme);
                contextParts.push(`README:\n${truncated}`);
            }

            if (languages && Object.keys(languages).length > 0) {
                const total = Object.values(languages).reduce((a, b) => a + b, 0);
                const langPct = Object.entries(languages)
                    .sort(([, a], [, b]) => b - a)
                    .map(([lang, bytes]) => `${lang}: ${((bytes / total) * 100).toFixed(1)}%`)
                    .join(", ");
                contextParts.push(`Languages: ${langPct}`);
            }

            const contextText = contextParts.join("\n\n");
            const chunks = chunkText(contextText, 1000);

            for (const chunk of chunks) {
                const embedding = await generateEmbedding(chunk);
                await prisma.$executeRaw`
          INSERT INTO "Embedding" (id, "interviewId", "sourceType", "chunkText", embedding, metadata, "createdAt")
          VALUES (gen_random_uuid(), ${interviewId}::uuid, 'RESUME_REPO'::"EmbeddingSourceType", ${chunk}, ${JSON.stringify(embedding)}::vector, ${JSON.stringify({ owner, repo })}::jsonb, NOW())
        `;
            }

            results.push({ repo: `${owner}/${repo}`, embedded: true });
        } catch {
            results.push({ repo: `${owner}/${repo}`, embedded: false });
        }
    }

    return results;
}

export async function parseResumeWithAI(rawText: string): Promise<ExtractedResume> {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_LLM_MODEL || "gemini-2.0-flash" });

    const prompt = `Extract structured information from this resume text. Return ONLY valid JSON with this exact shape:
{
  "skills": ["skill1", "skill2"],
  "experience": [{"title": "", "company": "", "duration": "", "description": ""}],
  "education": [{"school": "", "degree": "", "field": "", "year": ""}],
  "projects": [{"name": "", "description": "", "technologies": [""]}],
  "summary": "2-3 sentence professional summary"
}

RESUME TEXT:
${rawText}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```(?:json)?\s*/gi, "").trim();
    return JSON.parse(cleaned) as ExtractedResume;
}

export function buildResumeContext(parsed: ExtractedResume): string {
    const sections: string[] = [];

    if (parsed.summary) sections.push(`SUMMARY: ${parsed.summary}`);
    if (parsed.skills.length) sections.push(`SKILLS: ${parsed.skills.join(", ")}`);
    if (parsed.experience.length) {
        const expStr = parsed.experience.map(e => `- ${e.title} at ${e.company} (${e.duration}): ${e.description}`).join("\n");
        sections.push(`EXPERIENCE:\n${expStr}`);
    }
    if (parsed.projects.length) {
        const projStr = parsed.projects.map(p => `- ${p.name} (${p.technologies.join(", ")}): ${p.description}`).join("\n");
        sections.push(`PROJECTS:\n${projStr}`);
    }
    if (parsed.education.length) {
        const eduStr = parsed.education.map(e => `- ${e.degree} in ${e.field}, ${e.school} (${e.year})`).join("\n");
        sections.push(`EDUCATION:\n${eduStr}`);
    }

    return sections.join("\n\n");
}