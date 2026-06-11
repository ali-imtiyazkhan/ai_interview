import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { appRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use(appRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
  console.log(`Ollama: ${env.ollamaUrl} | Model: ${env.ollamaLlmModel}`);
});
