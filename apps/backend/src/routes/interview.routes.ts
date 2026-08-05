import { Router } from "express";
import { validate } from "../middleware/validate";
import { preInterviewSchema, answerSchema, embedGithubSchema } from "../schemas/interview.schema";
import { createPreInterview } from "../controllers/preInterview.controller";
import { startInterview, submitAnswer, getResult } from "../controllers/interview.controller";
import { embedGithubData } from "../controllers/github.controller";

const router = Router();

// Pre-interview: submit URL, fetch public data
router.post("/pre-interview", validate(preInterviewSchema), createPreInterview);

// Embed GitHub data (code, READMEs, languages) into vector DB
router.post("/pre-interview/embed-github", validate(embedGithubSchema), embedGithubData);

// Start interview: generates questions from embedded context
router.post("/interview/:id/start", startInterview);

// Submit an answer to a question
router.post("/interview/:id/answer", validate(answerSchema), submitAnswer);

// Get result
router.get("/interview/:id/result", getResult);

export { router as interviewRoutes };
