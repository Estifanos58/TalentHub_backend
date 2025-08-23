import { Router } from "express";
import { getAdminDashboard } from "../controllers/admin.controller";
import { validateUser } from "../middleware/validate_user.middleware";
import { isAdmin } from "../middleware/is_empolyer";

const router = Router();

router.get('/',validateUser, isAdmin ,getAdminDashboard)

export default router;