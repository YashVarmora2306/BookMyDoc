import e from "express";
import { GLOBAL_MESSAGE, RABBITMQ_QUEUE_NAME } from "../../constant/message"
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ"
import { IAppointmentData } from "./interface/user.interface"
import userService from "./user.service";


class UserController{

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
}

export default new UserController()