import "dotenv/config";

export const env = {
  port: parseInt(process.env["PORT"] ?? "3001", 10),
  databaseUrl: process.env["DATABASE_URL"] ?? "",
  githubToken: process.env["GITHUB_TOKEN"] ?? "",
  ollamaUrl: process.env["OLLAMA_URL"] ?? "http://localhost:11434",
  ollamaEmbeddingModel: process.env["OLLAMA_EMBEDDING_MODEL"] ?? "nomic-embed-text",
  ollamaLlmModel: process.env["OLLAMA_LLM_MODEL"] ?? "gemma3",
};
