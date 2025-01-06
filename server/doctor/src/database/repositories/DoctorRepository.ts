import { Repository } from "typeorm";
import { Doctor } from "../entities/Doctor";
import AppDataSource from "../config/dbConfig";


/**
 * Doctor repository class to handle database operations related to Doctor.
 */

class DoctorRepository {
    private repository: Repository<Doctor>;

    constructor() {
        this.repository = AppDataSource.getRepository(Doctor)
    }

    /**
     * Create and save an Doctor to the database.
     * @param Doctor - The Doctor entity to save.
     * @returns The saved Doctor entity.
     */

    public async createDoctor(Doctor: Doctor): Promise<Doctor> {
        return this.repository.save(Doctor);
    }

    /**
     * Find an Doctor by email.
     * @param email - Email of the Doctor to find.
     * @returns The Doctor entity if found, null otherwise.
     */

    public async findDoctorByEmail(email: string): Promise<Doctor | null> {
        return this.repository.findOne({
            where: { email },
            select: ["password"]
        })
    }

    /**
     * Get all Doctors
     * @returns An array of all Doctors.
     */

    public async getAllDoctors(): Promise<Doctor[] | null>{
        return this.repository.find();
    }

    /**
     * Find an Doctor by id.
     * @param id - Id of the doctor to find
     * @returns The Doctor entity if found, null otherwise.
     */

    public async findDoctorById(id: string): Promise<Doctor | null>{
        return this.repository.findOneBy({
            id
        });
    }

    /**
     * Find an Doctor by id and update.
     * @param id - Id of the doctor to find
     * @param data - Updated doctor data.
     * @returns The updated Doctor entity.
     */

    public async findDoctorByIdAndUpdate(id: string, data: Doctor): Promise<Doctor | null>{
        await this.repository.update(id, data);
        return this.repository.findOneBy({id});
    }
}

export default new DoctorRepository();