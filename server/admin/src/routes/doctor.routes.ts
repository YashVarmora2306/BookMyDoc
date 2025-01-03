import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createDoctorValidation } from "../components/Doctor/doctor.validation";
import validateMiddleware from "../middleware/validateMiddleware";
import { upload, multerErrorHandler } from "../middleware/multer";
import doctorController from "../components/Doctor/doctor.controller";


const router: Router = Router();

router.post("/create-doctor", authMiddleware, upload.single("profilePicture"),multerErrorHandler, createDoctorValidation, validateMiddleware, doctorController.createDoctor)

export default router

