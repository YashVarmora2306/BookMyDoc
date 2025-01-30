import e from "express";
import { GLOBAL_MESSAGE, RABBITMQ_QUEUE_NAME } from "../../constant/message"
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ"
import { IAppointmentData } from "./interface/user.interface"
import userService from "./user.service";


class UserController {

    /**
     * Book an appointment
     * @param appointmentData - appointment data
     */
    async bookAppointment(appointmentData: IAppointmentData) {
        try {
            const Appointment = await userService.bookAppointment(appointmentData);
            logger.info(__filename, "bookAppointment", "", "Appointment successfully booked.", Appointment);
            const reply = JSON.stringify({
                status: "success",
                message: "Appointment successfully booked.",
                data: "Appointment successfully booked."
            })
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply);
            logger.info(__filename, "bookAppointment", "", "Reply sent to user service.");
        } catch (error) {
            const reply = JSON.stringify({
                status: "error",
                message: GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR,
                data: error
            })
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply);
            logger.error(__filename, "bookAppointment", "", GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error);
        }
    }

    /**
     * Subscribe to appointment queue
     */
    async subscribeToAppointmentQueue() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.BOOK_APPOINTMENT_QUEUE, async (message: string) => {
                const appointmentData: IAppointmentData = JSON.parse(message);
                logger.info(__filename, "subscribeToAppointmentQueue", "", "Processing appointment request.");
                await this.bookAppointment(appointmentData);
                logger.info(__filename, "subscribeToAppointmentQueue", "", "Appointment successfully booked.");
            })
        } catch (error) {
            logger.error(__filename, "subscribeToAppointmentQueue", "", "Error processing doctor registration request: ", error);
        }
    }

    /**
     * List appointments by userId
     */
    async listAppointmentsByUserId() {

        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.GET_APPOINTMENT_BY_USER_ID_QUEUE, async (message: string) => {
                logger.info(__filename, "listAppointmentsByUserId", "", "Processing appointment request.");
                const appointments = await userService.getAppointmentsByUserId(message);
                const reply = JSON.stringify({
                    status: "success",
                    message: "Successfully retrieved appointments.",
                    data: JSON.stringify(appointments)
                })
                await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply);
                logger.info(__filename, "listAppointmentsByUserId", "", "Appointments successfully retrieved.")
            })
        } catch (error) {
            const reply = JSON.stringify({
                status: "error",
                message: error,
                data: null
            })
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply);
            logger.error(__filename, "listAppointmentByUserId", "", "Error processing get appointment by userId.")
        }
    }

    /**
     * Get appointment by AppointmentId
     */
    async getAppointmentById() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.GET_APPOINTMENT_BY_ID_QUEUE, async (message: string) => {
                logger.info(__filename, "getAppointmentById", "", "Processing appointment request.");
                const appointment = await userService.getAppointmentById(message);
                const reply = JSON.stringify({
                    status: "success",
                    message: "Successfully retrieved appointment.",
                    data: JSON.stringify(appointment)
                })
                await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply
                );
                logger.info(__filename, "getAppointmentById", "", "Appointment successfully retrieved.")
            })
        } catch (error) {
            const reply = JSON.stringify({
                status: "error",
                message: error,
                data: null
            })
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply
            );
            logger.error(__filename, "getAppointmentById", "", "Error processing get appointment by id.")
        }
    }

    /**
     * Cancel appointment.
     */
    async cancelAppointment() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.CANCEL_APPOINTMENT_QUEUE,
                async (message: string) => {
                    logger.info(__filename, "cancelAppointment", "", "Processing cancel appointment request.");
                    const appointment = await userService.cancelAppointment(message);
                }
            );
            logger.info(__filename, "cancelAppointment", "", "Appointment successfully cancelled.")
        } catch (error) {
            logger.error(__filename, "cancelAppointment", "", "Error processing cancel appointment.")
        }
    }
}

export default new UserController()