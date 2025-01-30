import { Appointment } from "../../database/entities/appointment";
import AppointmentRepository from "../../database/repositories/AppointmentRepository";
import { logger } from "../../utils/logger";
import { IAppointmentData } from "./interface/user.interface";


class UserService {

    /**
     * Book an appointment
     * @param appointmentData 
     * @returns 
     */

    async bookAppointment(appointmentData: IAppointmentData): Promise<Appointment> {
        try {
            // create a new appointment
            const AppointmentData = new Appointment
            AppointmentData.userId = appointmentData.userId
            AppointmentData.doctorId = appointmentData.doctorId
            AppointmentData.userData = appointmentData.userData
            AppointmentData.doctorData = appointmentData.doctorData
            AppointmentData.slotDate = appointmentData.slotDate
            AppointmentData.slotTime = appointmentData.slotTime
            AppointmentData.amount = appointmentData.amount
            AppointmentData.date = appointmentData.date

            const appointment = await AppointmentRepository.createAppointment(AppointmentData);
            return appointment;

        } catch (error) {
            logger.error(__filename, "bookAppointment", "", 'Error occurred', error)
            throw error
        }
    }

    /**
     * Get all appointments by userId
     * @param userId 
     * @returns 
     */
    async getAppointmentsByUserId(userId: string): Promise<Appointment[] | null> {
        try {
            const appointments = await AppointmentRepository.getUserAppointments(userId);

            return appointments;
        } catch (error) {
            logger.error(__filename, "getAppointmentsByUserId", "", 'Error occurred', error)
            throw error
        }
    }

    /**
     * Get appointment by appointmentId
     * @param appointmentId
     * @returns
     */
    async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
        try {
            const appointment = await AppointmentRepository.findAppointmentById(appointmentId);
            return appointment;
        } catch (error) {
            logger.error(__filename, "getAppointmentById", "", 'Error occurred', error)
            throw error
        }
    }

    /**
     * Cancel appointment
     * @param appointmentId
     * @returns
     */
    async cancelAppointment(appointmentId: string): Promise<Appointment | null> {
        try {
            const appointment = await AppointmentRepository.findAppointmentById(appointmentId);
            const updateAppointment = await AppointmentRepository.updateAppointment(appointmentId, {
                ...appointment,
                cancelled: true
            });
            return updateAppointment;
        } catch (error) {
            logger.error(__filename, "cancelAppointment", "", 'Error occurred', error)
            throw error
        }
    }
}

export default new UserService()