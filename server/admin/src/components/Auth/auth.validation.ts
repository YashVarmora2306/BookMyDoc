import { body } from "express-validator";
import { VALIDATION_MESSAGE } from "../../constant/message";


export const adminLoginValidation = [
    body("email").isEmail().notEmpty().withMessage(VALIDATION_MESSAGE.ADMIN.EMAIL_REQUIRED),
    body("password").notEmpty().withMessage(VALIDATION_MESSAGE.ADMIN.PASSWORD_REQUIRED),
]