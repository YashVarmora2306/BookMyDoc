import { Repository } from "typeorm";
import { Appointment } from "../entities/appointment";
import AppDataSource from "../config/dbConfig";


/**
 * Appointment repository class to handle database operations related to Appointment.
 */

class AppointmentRepository {
    private repository: Repository<Appointment>;

    constructor() {
        this.repository = AppDataSource.getRepository(Appointment)
    }


    /**
     * Create and save an appointment to the database.
     * @param appointment - The appointment entity to save.
     * @returns The saved appointment entity.
     */

    public async createAppointment(appointment: Appointment): Promise<Appointment> {
        return this.repository.save(appointment);
    }

    /**
     * Find an appointment by id.
     * @param id - Id of the appointment to find.
     * @return The appointment entity if found, null otherwise.
     */

    public async findAppointmentById(id: string): Promise<Appointment | null> {
        return this.repository.findOne({
            where: { id },
        });
    }

    /**
     * Get all Appointments
     * @returns An array of all Appointments.
     */

    public async getAllAppointments(): Promise<Appointment[] | null> {
        return this.repository.find();
    }

    /**
     * Get doctor appointments
     * @param doctorId - The id of the doctor to get appointments for.
     * @returns An array of all appointments for the doctor.
     */

    public async getDoctorAppointments(doctorId: string): Promise<Appointment[] | null> {
        return this.repository.find({
            where: { doctorId },
        });
    }

    /**
     * Get user appointments
     * @param userId - The id of the user to get appointments for.
     * @returns An array of all appointments for the user.
     */
    public async getUserAppointments(userId: string): Promise<Appointment[] | null> {
        return this.repository.find({
            where: { userId },
        });
    }

}

export default new AppointmentRepository()