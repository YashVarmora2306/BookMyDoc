import { body } from "express-validator";
import { VALIDATION_MESSAGE } from "../../constant/message";

export const registerUserValidation = [
    body("firstName")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.USER.FIRST_NAME_REQUIRED),
    body("lastName")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.USER.LAST_NAME_REQUIRED),
    body("email")
        .isEmail()
        .withMessage(VALIDATION_MESSAGE.USER.EMAIL_REQUIRED),
    body("password")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.USER.PASSWORD_REQUIRED),
];

export const loginUserValidation = [
    body("email")
        .isEmail()
        .withMessage(VALIDATION_MESSAGE.USER.EMAIL_REQUIRED)
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.USER.EMAIL_REQUIRED),
    body("password")
        .notEmpty()
        .withMessage(VALIDATION_MESSAGE.USER.PASSWORD_REQUIRED),

]