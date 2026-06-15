import axios from "axios";
import { env } from "../config/env";
import type { GitHubRepo } from "../types";

const github = axios.create({
  baseURL: "https://api.github.com",
  ...(env.githubToken && { headers: { Authorization: `Bearer ${env.githubToken}` } }),
});

function mapRepo(repo: {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
}): GitHubRepo {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    starCount: repo.stargazers_count,
    language: repo.language,
    topics: repo.topics ?? [],
    readme: null,
  };
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const { data } = await github.get(
      `/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
    );
    if (!data.length) break;

    repos.push(...data.map(mapRepo));

    if (data.length < 100) break;
    page++;
  }

  return repos;
}

/** Top repos get README deep-embed; the rest stay in the lightweight summary only. */
export function selectReposForDeepEmbed(repos: GitHubRepo[], limit = env.githubMaxDeepRepos): GitHubRepo[] {
  return [...repos].sort((a, b) => b.starCount - a.starCount).slice(0, limit);
}

export function buildRepoSummaryLine(repo: GitHubRepo): string {
  const topics = repo.topics.length > 0 ? repo.topics.join(", ") : "none";
  return `- ${repo.name}: ${repo.description ?? "No description"} | ${repo.language ?? "Unknown"} | ${repo.starCount} stars | topics: ${topics}`;
}

/** Compact overview of every repo — one or a few embedding calls instead of one per repo. */
export function buildRepoSummaryChunks(
  repos: GitHubRepo[],
  maxChunkSize = env.githubSummaryChunkSize,
): string[] {
  if (repos.length === 0) return [];

  const header = `GitHub profile overview (${repos.length} repositories):\n`;
  const lines = repos.map(buildRepoSummaryLine);
  const chunks: string[] = [];
  let current = header;

  for (const line of lines) {
    const next = `${current}${line}\n`;
    if (next.length > maxChunkSize && current !== header) {
      chunks.push(current.trim());
      current = `${line}\n`;
    } else {
      current = next;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export function truncateReadme(readme: string, maxChars = env.githubMaxReadmeChars): string {
  if (readme.length <= maxChars) return readme;
  return `${readme.slice(0, maxChars).trim()}\n\n[README truncated for embedding limits]`;
}

export async function fetchRepoLanguages(username: string, repo: string): Promise<Record<string, number>> {
  const { data } = await github.get(`/repos/${username}/${repo}/languages`);
  return data;
}

export async function fetchRepoReadme(username: string, repo: string): Promise<string | null> {
  try {
    const { data } = await github.get(`/repos/${username}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.raw+json" },
    });
    return typeof data === "string" ? data : null;
  } catch {
    return null;
  }
}
