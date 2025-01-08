import { Repository } from "typeorm";
import { User } from "../entities/User";
import AppDataSource from "../config/dbConfig";


/**
 * User repository class to handle database operations related to User.
 */

class UserRepository{
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User)
    }

    /**
     * @param user - The user entity to save.
     * Create and save an user to the database.
     * @returns The saved user entity.
     */

    public async createUser(user: User): Promise<User>{
        return this.repository.save(user);
    }

    /**
     * Find an user by email.
     * @param email - Email of the user to find.
     * @returns The user entity if found, null otherwise.
     */

    public async findUserByEmail(email: string): Promise<User | null>{
        return this.repository.findOne({
            where: { email },
            select:["password", "email","id"]
        })
    }

    /**
     * Find an user by id.
     * @param id - Id of the user to find.
     * @return The user entity if found, null otherwise.
     */

    public async findUserById(id: string): Promise<User | null> {
        return this.repository.findOne({
            where: { id },
        });
        }

    /**
     * Find an user by id and update.
     * @param id - Id of the user to find
     * @param data - Updated user data.
     * @returns The updated user entity.
     */

    public async findUserByIdAndUpdate(id: string, data: Partial<User>): Promise<User | null> {
        await this.repository.update(id, data);
        return this.repository.findOneBy({ id });
    }
}

export default new UserRepository()