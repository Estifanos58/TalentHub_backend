import { Router } from "express";
import { applyForJob, getApplication } from "../controllers/application.controller";
import { validateUser } from "../middleware/validate_user.middleware";

const router = Router();

router.post('/',validateUser, applyForJob)
router.get('/:id', getApplication);

export default router;