import { Router } from "express";
import authController from "../components/Auth/auth.controller";
import validateMiddleware from "../middleware/validateMiddleware";
import { doctorLoginValidation } from "../components/Auth/auth.validation";

const router: Router = Router();

// Login a Doctor
router.post("/login", doctorLoginValidation, validateMiddleware, authController.login);

export default router;