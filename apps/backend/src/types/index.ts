export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string | null;
  starCount: number;
  language: string | null;
  topics: string[];
  readme: string | null;
}
