import axios from "axios";
import { env } from "../config/env";
import type { GitHubRepo } from "../types";

const github = axios.create({
  baseURL: "https://api.github.com",
  ...(env.githubToken && { headers: { Authorization: `Bearer ${env.githubToken}` } }),
});

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const { data } = await github.get(`/users/${username}/repos?per_page=100`);
  return data.map((repo: any) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    starCount: repo.stargazers_count,
    language: repo.language,
    topics: repo.topics ?? [],
    readme: null,
  }));
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
