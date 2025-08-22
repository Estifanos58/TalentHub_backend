import { Router } from "express";
import { validateUser } from "../middleware/validate_user.middleware";
import { isEmployer } from "../middleware/is_empolyer";
import { createJob, getJobById, getJobs } from "../controllers/job.controller";

const router = Router();

router.post("/", validateUser , isEmployer, createJob);
router.get("/", getJobs)
router.get("/:id", getJobById) // Reusing getJobs to fetch by ID

export default router;