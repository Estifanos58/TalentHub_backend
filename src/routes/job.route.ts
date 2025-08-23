import { Router } from "express";
import { validateUser } from "../middleware/validate_user.middleware";
import { isEmployer } from "../middleware/is_empolyer";
import { createJob, deleteJob, getJobById, getJobs } from "../controllers/job.controller";

const router = Router();

router.post("/", validateUser , isEmployer, createJob);
router.get("/", getJobs)
router.get("/:id", getJobById) 
router.delete('/:id', validateUser, deleteJob)

export default router;