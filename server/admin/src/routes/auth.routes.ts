import { Router } from "express";
import authController from "../components/Auth/auth.controller";
import { adminLoginValidation } from "../components/Auth/auth.validation";
import validateMiddleware from "../middleware/validateMiddleware";

const router: Router = Router();

// Login a Admin
router.post("/login", adminLoginValidation, validateMiddleware, authController.login);

export default router;