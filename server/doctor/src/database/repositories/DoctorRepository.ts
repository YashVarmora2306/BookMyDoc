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
     * Count the number of Doctors in the database.
     * @returns The number of Doctors in the database.
     */

    public async countDoctors(): Promise<number> {
        return this.repository.count();
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

    public async getAllDoctors(): Promise<Doctor[] | null>{
        return this.repository.find();
    }

}

export default new DoctorRepository();