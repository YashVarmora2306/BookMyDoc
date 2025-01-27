import AppointmentRepository from "../../database/repositories/AppointmentRepository"
import { logger } from "../../utils/logger";


class AdminService{

    async getDoctorAppointments(doctorId: string) {
        try {
            const appointments = await AppointmentRepository.getDoctorAppointments(doctorId);
            return appointments;
        } catch (error) {
            logger.error(__filename, 'getDoctorAppointments', '', 'Error occurred', error);
            throw error;
        }
    }
}

export default new AdminService()