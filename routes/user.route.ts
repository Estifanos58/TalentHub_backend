import { Router } from "express";
import { registerUserController } from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUserController);

export default router;