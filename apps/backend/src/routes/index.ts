import { Router } from "express";
import { interviewRoutes } from "./interview.routes";
import resumeRoutes from "./resume.routes";

const router = Router();

router.use("/api/v1", interviewRoutes);
router.use("/api/v1/resume", resumeRoutes);

export { router as appRoutes };
