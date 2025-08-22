import { Router } from "express";
import { getUserController, loginUserController, registerUserController } from "../controllers/user.controller";
import { validateUser } from "../middleware/validate_user.middleware";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/user", validateUser, getUserController);

export default router;