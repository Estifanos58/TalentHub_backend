import { Router } from "express";
import { applyForJob, getApplicationById, getApplications } from "../controllers/application.controller";
import { validateUser } from "../middleware/validate_user.middleware";

const router = Router();

router.post('/',validateUser, applyForJob)
router.get('/',validateUser, getApplications);
router.get('/:id', validateUser, getApplicationById)

export default router;