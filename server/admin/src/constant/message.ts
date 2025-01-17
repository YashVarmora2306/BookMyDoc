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
    ADMIN_NOT_FOUND: "Admin not found.",
    INVALID_CREDENTIALS: "Invalid credentials",
    IMAGE_NOT_FOUND: "Image not found."
}

export const SUCCESS_MESSAGE = {
    LOGIN_SUCCESS: "Successfully logged in",
    DOCTOR_CREATED: "Doctor created successfully.",
    DOCTORS_FOUND: "Doctors Found successfully",
    APPOINTMENTS_FOUND: "Appointments Found successfully",
    AVAILABILITY_CHANGED: "Successfully Availability changed.",
    DASH_DATA_FOUND: "Successfully dashboard data found"
}

export const VALIDATION_MESSAGE = {
    ADMIN: {
        EMAIL_REQUIRED: "Email is required",
        PASSWORD_REQUIRED: "Password is required",
    },
    DOCTOR: {
        FIRST_NAME_REQUIRED: "First name is required",
        LAST_NAME_REQUIRED: "Last name is required",
        EMAIL_REQUIRED: "Email is required",
        PASSWORD_REQUIRED: "Password is required",
        SPECIALIST_REQUIRED: "Specialist field is required.",
        DEGREE_REQUIRED: "Degree is required.",
        EXPERIENCE_REQUIRED: "Experience is required.",
        ABOUT_REQUIRED: "About field is required.",
        FEES_NON_NEGATIVE_NUMBER: "Fees must be a non-negative number.",
        ADDRESS_REQUIRED: "Address is required."
    }
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