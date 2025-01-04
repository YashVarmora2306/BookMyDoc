import { RABBITMQ_QUEUE_NAME } from "../../constant/message";
import handleUpload from "../../utils/helper/handleUpload";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { IDoctorData, IDoctorPayload } from "./interface/doctor.interface";

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
                await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_QUEUE, message);
                logger.info(__filename, "createDoctor", "", `Doctor creation requested successfully.`)
                return doctorData;

            } catch (error) {
                logger.error(__filename, "createDoctor", "", "Error while creating doctor request: ", error)
                throw error
            }
        }
}

export default new DoctorService();