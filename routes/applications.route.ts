import { Router } from "express";
import { applyForJob, getApplication } from "../controllers/application.controller";
import { validateUser } from "../middleware/validate_user.middleware";

const router = Router();

router.post('/applications',validateUser, applyForJob)
router.get('/applications/:id', getApplication);