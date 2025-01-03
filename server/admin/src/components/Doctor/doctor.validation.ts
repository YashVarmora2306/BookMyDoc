import { body } from "express-validator";
import { VALIDATION_MESSAGE } from "../../constant/message";

export const createDoctorValidation = [
    body("firstName")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.FIRST_NAME_REQUIRED),
    body("lastName")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.LAST_NAME_REQUIRED),
    body("email")
        .isEmail()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.EMAIL_REQUIRED),
    body("password")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.PASSWORD_REQUIRED),
    body("specialist")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.SPECIALIST_REQUIRED),
    body("degree")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.DEGREE_REQUIRED),
    body("experience")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.EXPERIENCE_REQUIRED),
    body("about")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.ABOUT_REQUIRED),
    body("fees")
        .isFloat({ min: 0 })
        .withMessage(VALIDATION_MESSAGE.DOCTOR.FEES_NON_NEGATIVE_NUMBER),
    body("address")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.DOCTOR.ADDRESS_REQUIRED),
];
