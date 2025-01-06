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
    DOCTOR_NOT_FOUND: "Doctor not found.",
    INVALID_CREDENTIALS: "Invalid credentials",
    EXISTING_EMAIL: "Email already exists.",
    ID_NOT_FOUND: "Id not found."
}

export const SUCCESS_MESSAGE = {
    LOGIN_SUCCESS: "Successfully logged in",
    DOCTOR_ADDED: "Doctor added successfully",
    SUCCESSFULLY_RETRIEVED_DOCTORS: "Successfully retrieved doctors",
    AVAILABILITY_CHANGED: "Successfully Availability changed.",
    DOCTOR_PROFILE: "Successfully get profile.",
    DOCTOR_PROFILE_UPDATED:"Profiel Updated successfully",
    
}

export const VALIDATION_MESSAGE = {
    DOCTOR: {
        EMAIL_REQUIRED: "Email is required",
        PASSWORD_REQUIRED: "Password is required",
    }
}

export const RABBITMQ_QUEUE_NAME = {
    DOCTOR_CREATION_QUEUE: "doctorCreationQueue",
    DOCTOR_REPLY_QUEUE: "doctorReplyQueue",
    ERROR_QUEUE: "errorQueue",
    GET_DOCTORS_QUEUE: "getDoctorsQueue",
    CHANGE_AVAILABILITY_QUEUE: "changeAvailabilityQueue"
}