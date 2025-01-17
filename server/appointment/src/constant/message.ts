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
    APPOINTMENT_NOT_FOUND: "Appointment not found.",
    INVALID_CREDENTIALS: "Invalid credentials",
    IMAGE_NOT_FOUND: "Image not found."
}

export const SUCCESS_MESSAGE = {
    LOGIN_SUCCESS: "Successfully logged in",
    APPOINTMENT_CREATED: "Appointment created successfully.",
    APPOINTMENT_FOUND: "Appointment Found successfully",
    SUCCESSFULLY_RETRIEVED_APPOINTMENTS: "Successfully retrieved appointments"
}

export const VALIDATION_MESSAGE = {
    
}

export const RABBITMQ_QUEUE_NAME = {
    DOCTOR_CREATION_QUEUE: "doctorCreationQueue",
    DOCTOR_REPLY_QUEUE: "doctorReplyQueue",
    APPOINTMENT_REPLY_QUEUE: "appointmentReplyQueue",
    ERROR_QUEUE: "errorQueue",
    GET_APPOINTMENT_QUEUE: "getAppointmentsQueue",
    CHANGE_AVAILABILITY_QUEUE: "changeAvailabilityQueue",
    USER_REPLY_QUEUE: "userReplyQueue",
    GET_DOCTORS_QUEUE: "getDoctorsQueue",
    GET_USERS_QUEUE: "getUsersQueue",
}