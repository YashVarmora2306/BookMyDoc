import { Router } from "express";
import authController from "../components/Auth/auth.controller";
import validateMiddleware from "../middleware/validateMiddleware";
import { doctorLoginValidation } from "../components/Auth/auth.validation";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router();

// Login a Doctor
router.post("/login", doctorLoginValidation, validateMiddleware, authController.login);

// Doctor profile
router.get("/profile", authMiddleware, authController.DoctorProfile);

// Update Profile
router.post("/update-profile", authMiddleware, authController.updateDoctorProfile);

export default router;