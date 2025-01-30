import { RABBITMQ_QUEUE_NAME } from "../../constant/message";
import UserRepository from "../../database/repositories/UserRepository";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { IAppointment, IAppointmentPayload, IAppointmentResponse, IReplayFromService } from "./interface/appointment.interface";


class AppointmentService {

    /**
     * Handles receiving a reply from the doctor service through RabbitMQ.
     * @returns - The response from the doctor service.
     */
    async getReplyFromDoctor(): Promise<IReplayFromService> {
        return new Promise(async (resolve, reject) => {
            const consumerTag = await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_REPLY_QUEUE, async (message: string) => {
                try {
                    const messageData = JSON.parse(message);
                    resolve(messageData);
                    logger.info(__filename, "getReplyFromDoctor", "", "Reply from Doctor service: ", messageData);

                    await rabbitMQ.unsubscribeFromQueue(consumerTag);
                } catch (error) {
                    logger.error(__filename, "getReplyFromDoctor", "", "Error while receiving reply from Doctor")
                    reject(error);
                }
            });
        });
    }

    /**
     * Handles receiving a reply from the appointment service through RabbitMQ.
     * @returns - The response from the appointment service.
     */

    async getReplyFromAppointment(): Promise<IReplayFromService> {
        return new Promise(async (resolve, reject) => {
            const consumerTag = await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, async (message: string) => {
                try {
                    const messageData = JSON.parse(message);
                    resolve(messageData);
                    logger.info(__filename, "getReplyFromAppointment", "", "Reply from Appointment service: ", messageData);

                    await rabbitMQ.unsubscribeFromQueue(consumerTag);
                } catch (error) {
                    logger.error(__filename, "getReplyFromAppointment", "", "Error while receiving reply from Appointment")
                    reject(error);
                }
            });
        });
    }

    /**
     * Book an appointment with a doctor.
     * @param appointmentData 
     * @returns 
     */

    async bookAppointment(appointmentData: IAppointmentPayload): Promise<IAppointment> {
        try {
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_DOCTOR_BY_ID_QUEUE, appointmentData.doctorId)
            logger.info(__filename, "bookAppointment", "", "Requested to get doctor data.")
            const reply = await this.getReplyFromDoctor()
            if (reply.status === "error") {
                throw new Error(reply.message)
            }
            const doctor = {
                status: reply.status,
                message: reply.message,
                data: JSON.parse(reply.data)
            }
            if (!doctor.data) {
                throw new Error("Doctor not found")
            }
            if (!doctor.data.available) {
                throw new Error("Doctor is not available")
            }

            const slots_Booked = doctor.data.slots_booked || {};

            //Check slot availability
            if (slots_Booked[appointmentData.slotDate]?.includes(appointmentData.slotTime)) {
                throw new Error("Slot not available")
            }

            //Add slot to booked slots
            if (!slots_Booked[appointmentData.slotDate]) {
                slots_Booked[appointmentData.slotDate] = []
            }
            await slots_Booked[appointmentData.slotDate].push(appointmentData.slotTime)

            //Fetch user data 
            const userData = await UserRepository.findUserById(appointmentData.userId);
            if (!userData) {
                throw new Error("User not found")
            }
            delete doctor.data.slots_booked

            //appointment data
            const appointment = JSON.stringify({
                userId: userData.id,
                doctorId: doctor.data.id,
                userData: userData,
                doctorData: doctor.data,
                amount: doctor.data.fees,
                slotTime: appointmentData.slotTime,
                slotDate: appointmentData.slotDate,
                date: Date.now()
            })


            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.BOOK_APPOINTMENT_QUEUE, appointment)
            logger.info(__filename, "bookAppointment", "", "Requested to book appointment.")

            //save new slot in doctor data
            doctor.data.slots_booked = slots_Booked

            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.UPDATE_DOCTOR_QUEUE, JSON.stringify(doctor.data))
            logger.info(__filename, "bookAppointment", "", "Requested to update doctor data.")

            return JSON.parse(appointment)

        } catch (error) {
            logger.error(__filename, "bookAppointment", "", "Error while booking appointment: ", error)
            throw error
        }
    }

    /**
     * List all appointments of a user.
     * @param userId 
     * @returns 
     */
    async listAppointments(userId: string): Promise<IAppointmentResponse> {
        try {
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_APPOINTMENT_BY_USER_ID_QUEUE, userId)
            logger.info(__filename, "listAppointments", "", "Requested to get appointments of user.")
            const reply = await this.getReplyFromAppointment()
            const appointments = {
                status: reply.status,
                message: reply.message,
                data: JSON.parse(reply.data)
            }
            return appointments

        } catch (error) {
            logger.error(__filename, "listAppointments", "", "Error while getting appointments: ", error)
            throw error
        }
    }

    /**
     * Cancel appointment
     * @param appointmentId
     * @param userId
     * @returns
     */

    async cancelAppointment(appointmentId: string, userId: string): Promise<void> {
        try {
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_APPOINTMENT_BY_ID_QUEUE, appointmentId)
            logger.info(__filename, "cancelAppointment", "", "Requested to get appointment by appointmentId.")
            const appointmentReply = await this.getReplyFromAppointment()
            const appointment = {
                status: appointmentReply.status,
                message: appointmentReply.message,
                data: JSON.parse(appointmentReply.data)
            }
            if (appointment.data.userId !== userId) {
                throw new Error("Unauthorized action")
            }
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.CANCEL_APPOINTMENT_QUEUE, appointmentId)
            logger.info(__filename, "cancelAppointment", "", "Appointment cancelled successfully.")

            //  Updating doctor slot
            const { doctorId, slotDate, slotTime } = appointment.data
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_DOCTOR_BY_ID_QUEUE, doctorId)
            logger.info(__filename, "cancelAppointment", "", "Requested to get doctor by doctorID.")
            const doctorReply = await this.getReplyFromDoctor()
            const doctor = {
                status: doctorReply.status,
                message: doctorReply.message,
                data: JSON.parse(doctorReply.data)
            }
            doctor.data.slots_booked[slotDate] = doctor.data.slots_booked[slotDate].filter(
                (slot:string)=> slot !== slotTime.substring(0,5)
            )
            const message = JSON.stringify(
                doctor.data
            )
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.UPDATE_DOCTOR_QUEUE, message)
            logger.info(__filename, "cancelAppointment", "", "Doctor slot updated successfully.")

        } catch (error) {
            logger.error(__filename, "cancelAppointment", "", "Error while canceling appointment.")
            throw error
        }
    }
}

export default new AppointmentService()