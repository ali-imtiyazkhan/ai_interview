import { chromium } from "playwright";
import type { LinkedInProfile, LinkedInExperience, LinkedInEducation } from "../types";

export async function scrapeLinkedInProfile(url: string): Promise<LinkedInProfile & { rawText: string }> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  });

  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    await page.waitForTimeout(3000);

    const name = await page
      .locator("h1")
      .first()
      .textContent()
      .then((t) => t?.trim() ?? "")
      .catch(() => "");

    const headline = await page
      .locator("div.text-body-medium")
      .first()
      .textContent()
      .then((t) => t?.trim() ?? null)
      .catch(() => null);

    const skills: string[] = [];
    const skillElements = page.locator(
      '[class*="skill"], [class*="Skill"], span[class*="pill"], [data-field="skills"] span',
    );
    const skillCount = await skillElements.count().catch(() => 0);
    for (let i = 0; i < Math.min(skillCount, 30); i++) {
      const text = await skillElements.nth(i).textContent().catch(() => "");
      if (text?.trim()) skills.push(text.trim());
    }

    const experience: LinkedInExperience[] = [];
    const expCards = page.locator(
      "section#experience-section li, [data-section*=experience] li, article[class*=experience]",
    );
    const expCount = await expCards.count().catch(() => 0);
    for (let i = 0; i < Math.min(expCount, 15); i++) {
      const card = expCards.nth(i);
      const text = await card.textContent().catch(() => "");
      if (text?.trim()) {
        const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
        experience.push({
          title: lines[0] ?? "",
          company: lines[1] ?? "",
          duration: lines.find((l) => l.includes("·") || l.includes("–") || l.includes("-")) ?? "",
          description: lines.slice(2).join(" ") || null,
        });
      }
    }

    const education: LinkedInEducation[] = [];
    const eduCards = page.locator("section#education-section li, [data-section*=education] li");
    const eduCount = await eduCards.count().catch(() => 0);
    for (let i = 0; i < Math.min(eduCount, 10); i++) {
      const card = eduCards.nth(i);
      const text = await card.textContent().catch(() => "");
      if (text?.trim()) {
        const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
        education.push({
          school: lines[0] ?? "",
          degree: lines[1] ?? null,
          field: lines[2] ?? null,
          duration: lines.find((l) => l.includes("–") || l.includes("-")) ?? "",
        });
      }
    }

    const rawText = [
      `Name: ${name}`,
      headline ? `Headline: ${headline}` : "",
      skills.length ? `Skills: ${skills.join(", ")}` : "",
      ...experience.map((e) => `Experience: ${e.title} at ${e.company} (${e.duration}) - ${e.description ?? ""}`),
      ...education.map((e) => `Education: ${e.degree ?? ""} in ${e.field ?? ""} at ${e.school} (${e.duration})`),
    ]
      .filter(Boolean)
      .join("\n\n");

    return { name, headline, experience, education, skills, rawText };
  } catch (error) {
    return {
      name: "",
      headline: null,
      experience: [],
      education: [],
      skills: [],
      rawText: "",
    };
  } finally {
    await browser.close();
  }
}
