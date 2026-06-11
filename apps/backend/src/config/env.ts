import "dotenv/config";

export const env = {
  port: parseInt(process.env["PORT"] ?? "3001", 10),
  databaseUrl: process.env["DATABASE_URL"] ?? "",
  githubToken: process.env["GITHUB_TOKEN"] ?? "",
  geminiApiKey: process.env["GEMINI_API_KEY"] ?? "",
  geminiLlmModel: process.env["GEMINI_LLM_MODEL"] ?? "gemini-2.0-flash",
  geminiEmbeddingModel: process.env["GEMINI_EMBEDDING_MODEL"] ?? "text-embedding-004",
};
