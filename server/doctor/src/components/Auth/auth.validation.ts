import { body } from "express-validator";
import { VALIDATION_MESSAGE } from "../../constant/message";


export const doctorLoginValidation = [
    body("email").isEmail()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.EMAIL_REQUIRED)
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.EMAIL_REQUIRED),
    body("password").notEmpty().withMessage(VALIDATION_MESSAGE.DOCTOR.PASSWORD_REQUIRED),
]