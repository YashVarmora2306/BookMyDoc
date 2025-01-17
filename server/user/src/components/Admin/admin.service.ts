import UserRepository from "../../database/repositories/UserRepository"
import { logger } from "../../utils/logger";


class AdminService{

    /**
     * Get all user.
     */

    async getAllUsers() {
        try {
            const users = await UserRepository.getAllUsers()
            return users;
        } catch (error) {
            logger.error(__filename, 'getAllUsers', '', 'Error occurred', error);
            throw error;
        }
    }
}

export default new AdminService()