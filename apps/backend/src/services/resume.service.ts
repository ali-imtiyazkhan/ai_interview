import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ExtractedResume {
    skills: string[];
    experience: { title: string; company: string; duration: string; description: string }[];
    education: { school: string; degree: string; field: string; year: string }[];
    projects: { name: string; description: string; technologies: string[] }[];
    summary: string;
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