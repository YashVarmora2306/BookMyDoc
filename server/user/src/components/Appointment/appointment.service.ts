import { RABBITMQ_QUEUE_NAME } from "../../constant/message";
import UserRepository from "../../database/repositories/UserRepository";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { IAppointment, IAppointmentData, IReplayFromService } from "./interface/appointment.interface";


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

    async bookAppointment(appointmentData: IAppointmentData): Promise<IAppointment> {
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

}

export default new AppointmentService()