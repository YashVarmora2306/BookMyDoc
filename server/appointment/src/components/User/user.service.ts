import { Appointment } from "../../database/entities/appointment";
import AppointmentRepository from "../../database/repositories/AppointmentRepository";
import { logger } from "../../utils/logger";
import { IAppointmentData } from "./interface/user.interface";


class UserService { 


    async bookAppointment(appointmentData: IAppointmentData): Promise<Appointment>{
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
}

export default new UserService()