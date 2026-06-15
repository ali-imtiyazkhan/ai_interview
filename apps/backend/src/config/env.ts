import "dotenv/config";

function parseIntEnv(key: string, fallback: number): number {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  port: parseIntEnv("PORT", 3001),
  databaseUrl: process.env["DATABASE_URL"] ?? "",
  githubToken: process.env["GITHUB_TOKEN"] ?? "",
  geminiApiKey: process.env["GEMINI_API_KEY"] ?? "",
  geminiLlmModel: process.env["GEMINI_LLM_MODEL"] ?? "gemini-2.0-flash",
  geminiEmbeddingModel: process.env["GEMINI_EMBEDDING_MODEL"] ?? "gemini-embedding-001",
  // Free-tier friendly GitHub embedding limits
  githubMaxDeepRepos: parseIntEnv("GITHUB_MAX_DEEP_REPOS", 8),
  githubMaxReadmeChars: parseIntEnv("GITHUB_MAX_README_CHARS", 3000),
  githubMaxReadmeChunks: parseIntEnv("GITHUB_MAX_README_CHUNKS", 2),
  githubSummaryChunkSize: parseIntEnv("GITHUB_SUMMARY_CHUNK_SIZE", 8000),
};
