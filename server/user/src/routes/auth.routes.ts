import { Router } from "express";
import authController from "../components/Auth/auth.controller";
import validateMiddleware from "../middleware/validateMiddleware";
import { loginUserValidation, registerUserValidation } from "../components/Auth/auth.validation";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";

const router: Router = Router();


router.post("/register", registerUserValidation, validateMiddleware, authController.registerUser);

router.post("/login", loginUserValidation, validateMiddleware, authController.login);

router.get("/profile", authMiddleware, authController.userProfile);

router.post("/update-profile", upload.single("profilePicture") ,authMiddleware ,authController.updateUserProfile)


export default router;  