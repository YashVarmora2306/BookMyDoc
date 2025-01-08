export const GLOBAL_MESSAGE = {
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden access",
    NOT_FOUND: "Not Found",
    BAD_REQUEST: "Bad Request",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    REQUEST_TIMEOUT: "The request took to long to process. Please try again later.",
    URL_NOT_FOUND: "URL not found",
    TOKEN_EXPIRED: "Token expired",
}

export const ERROR_MESSAGE = {
    JWT_SECRET_NOT_SET: "JWT_SECRET is not set in the environment variables",
    USER_NOT_FOUND: "User not found.",
    INVALID_CREDENTIALS: "Invalid credentials",
    IMAGE_NOT_FOUND: "Image not found.", EXISTING_EMAIL: "Email already exists.",
    ID_NOT_FOUND:"Id not found"
}

export const SUCCESS_MESSAGE = {
    LOGIN_SUCCESS: "Successfully logged in",
    USER_REGISTER: "User register successfully.",
    USER_FOUND: "User Found successfully",
    USER_PROFILE: "User Found",
    USER_PROFILE_UPDATED: "User profile updated successfully"
}

export const VALIDATION_MESSAGE = {
    USER: {
        EMAIL_REQUIRED: "Email is required",
        PASSWORD_REQUIRED: "Password is required",
        FIRST_NAME_REQUIRED: "First name is required",
        LAST_NAME_REQUIRED: "Last name is required",
    },
}

export const RABBITMQ_QUEUE_NAME = {
    DOCTOR_CREATION_QUEUE: "doctorCreationQueue",
    DOCTOR_REPLY_QUEUE: "doctorReplyQueue",
    ERROR_QUEUE: "errorQueue",
    GET_DOCTORS_QUEUE: "getDoctorsQueue",
    CHANGE_AVAILABILITY_QUEUE:"changeAvailabilityQueue"
}