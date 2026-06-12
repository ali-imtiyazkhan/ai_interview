import type { LinkedInProfile } from "../types";

export async function scrapeLinkedInProfile(_url: string): Promise<LinkedInProfile> {
  // LinkedIn scraping requires a headless browser and is prone to anti-bot measures.
  // For now, return empty — the frontend should collect manual profile data.
  return {
    name: "",
    headline: null,
    experience: [],
    education: [],
    skills: [],
  };
}
