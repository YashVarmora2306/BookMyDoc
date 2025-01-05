import { RABBITMQ_QUEUE_NAME } from "../../constant/message";
import handleUpload from "../../utils/helper/handleUpload";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { IDoctorData, IDoctorPayload, IReplayFromDoctor } from "./interface/doctor.interface";

class DoctorService {

    /**
   * Creates a new doctor by sending a message to the doctor Service.
   * @param doctorData - The doctor data to be created.
   */
    async createDoctor(doctorPayload: IDoctorPayload): Promise<IDoctorData> {
        try {
            const profilePicture = await handleUpload(doctorPayload.profilePicture)
            const doctorData = {
                ...doctorPayload,
                profilePicture: profilePicture
            }
            const message = JSON.stringify(doctorData);
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_CREATION_QUEUE, message);
            logger.info(__filename, "createDoctor", "", `Doctor creation requested successfully.`)
            return doctorData;

        } catch (error) {
            logger.error(__filename, "createDoctor", "", "Error while creating doctor request: ", error)
            throw error
        }
    }

    /**
     * Handles receiving a reply from the doctor service through RabbitMQ.
     * @returns - The response from the doctor service.
     */
    async getReplyFromDoctor(): Promise<IReplayFromDoctor> {
        return new Promise(async(resolve, reject) => {
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
     * Get all Doctors by sending a request to the doctor service.
     * @returns 
     */

    async getAllDoctor(): Promise<IReplayFromDoctor> {
        try {
            const message = "Request to get all Doctors."
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_DOCTORS_QUEUE, message)
            logger.info(__filename, "getAllDoctor", "", "Requested to get all Doctors.")
            const reply = await this.getReplyFromDoctor()
            const doctors = {
                status: reply.status,
                message: reply.message,
                data: JSON.parse(reply.data)

            }
            return doctors
        } catch (error) {
            logger.error(__filename, "getAllDoctor", "", "Error while getting all doctors: ", error)
            throw error
        }
        
    }
}

export default new DoctorService();