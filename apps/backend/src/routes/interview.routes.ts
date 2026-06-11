import { Router } from "express";
import { validate } from "../middleware/validate";
import { preInterviewSchema, answerSchema } from "../schemas/interview.schema";
import { createPreInterview } from "../controllers/preInterview.controller";
import { startInterview, submitAnswer, getResult } from "../controllers/interview.controller";
import { embedGithubData } from "../controllers/github.controller";
import { embedLinkedinData } from "../controllers/linkedin.controller";

const router = Router();

// Pre-interview: submit URLs, fetch public data
router.post("/pre-interview", validate(preInterviewSchema), createPreInterview);

// Embed GitHub data (code, READMEs, languages) into vector DB
router.post("/pre-interview/embed-github", embedGithubData);

// Embed LinkedIn data into vector DB
router.post("/pre-interview/embed-linkedin", embedLinkedinData);

// Start interview: generates questions from embedded context
router.post("/interview/:id/start", startInterview);

// Submit an answer to a question
router.post("/interview/:id/answer", validate(answerSchema), submitAnswer);

// Get result
router.get("/interview/:id/result", getResult);

export { router as interviewRoutes };
