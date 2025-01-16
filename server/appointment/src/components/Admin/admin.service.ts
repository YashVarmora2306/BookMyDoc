import AppointmentRepository from "../../database/repositories/AppointmentRepository"
import { logger } from "../../utils/logger";


class AdminService{

    async getAllAppointments() {
        try {
            const appointments = await AppointmentRepository.getAllAppointments();
            return appointments;
        } catch (error) {
            logger.error(__filename, 'getAllAppointments', '', 'Error occurred', error);
            throw error;
        }
    }
}

export default new AdminService()