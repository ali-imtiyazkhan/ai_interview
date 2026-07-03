import { Router } from "express";
import multer from "multer";
import { uploadResume, parseResumeText } from "../controllers/resume.controller";
import { resumeUploadSchema, resumeParseSchema } from "../schemas/resume.schema";
import { validate } from "../middleware/validate";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload",upload.single("resume"),validate(resumeUploadSchema,"body"),uploadResume);
router.post("/parse-text",validate(resumeParseSchema,"body"),parseResumeText);

export default router;