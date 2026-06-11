import { Router } from "express";
import { interviewRoutes } from "./interview.routes";

const router = Router();

router.use("/api/v1", interviewRoutes);

export { router as appRoutes };
