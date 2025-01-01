import { Repository } from "typeorm";
import { Admin } from "../entities/Admin";
import AppDataSource from "../config/dbConfig";


/**
 * Admin repository class to handle database operations related to Admin.
 */

export class AdminRepository{
    private repository: Repository<Admin>;

    constructor() {
        this.repository = AppDataSource.getRepository(Admin)
    }

    /**
     * Count the number of admins in the database.
     * @returns The number of admins in the database.
     */

    public async countAdmins(): Promise<number>{
        return this.repository.count();
    }

    /**
     * Create and save an admin to the database.
     * @param admin - The admin entity to save.
     * @returns The saved admin entity.
     */

    public async createAdmin(admin: Admin): Promise<Admin>{
        return this.repository.save(admin);
    }

    /**
     * Find an admin by email.
     * @param email - Email of the admin to find.
     * @returns The admin entity if found, null otherwise.
     */

    public async findAdminByEmail(email: string): Promise<Admin | null>{
        return this.repository.findOne({
            where: { email },
            select:["password"]
        })
    }

}