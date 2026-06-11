import type { LinkedInProfile } from "../types";

export async function scrapeLinkedInProfile(_url: string): Promise<LinkedInProfile> {
  // TODO: Implement with Playwright
  // For now, return a stub — LinkedIn scraping requires a headless browser
  // due to JS rendering and anti-bot measures.
  return {
    name: "",
    headline: null,
    experience: [],
    education: [],
    skills: [],
  };
}
