import { Router } from "express";
import { validateUser } from "../middleware/validate_user.middleware";
import { isEmployer } from "../middleware/is_empolyer";
import { createJob, getJobs } from "../controllers/job.controller";

const router = Router();

router.post("/jobs",validateUser, isEmployer, createJob);
router.get("/jobs", getJobs)

export default router;