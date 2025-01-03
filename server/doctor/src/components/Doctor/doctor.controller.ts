import { logger } from "../../utils/logger";
import { IDoctorData } from "./interface/doctor.interface";
import doctorService from "./doctor.service";
import { GLOBAL_MESSAGE, SUCCESS_MESSAGE } from "../../constant/message";


class DoctorController {
    /**
   * Handles user registration.
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   */

    async registerDoctor(doctorPayload: IDoctorData) {
        try {

            // Hash the password
            const hashedPassword = await doctorService.convertPlainTextToHash(doctorPayload.password);
            const doctorData: IDoctorData = {
                ...doctorPayload,
                password: hashedPassword
            }
            const doctor = await doctorService.createDoctor(doctorData);
            logger.info(__filename, "registerDoctor", "", SUCCESS_MESSAGE.DOCTOR_ADDED, doctor)

        } catch (error) {
            logger.error(__filename, "registerDoctor", "", GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }
}

export default new DoctorController()