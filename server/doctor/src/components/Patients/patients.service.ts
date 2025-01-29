import DoctorRepository from "../../database/repositories/DoctorRepository";
import { logger } from "../../utils/logger";
import { IDoctor } from "../Auth/interface/auth.interface";

class PatientsService {
  
    /**
     * Get doctor by id.
     * @param doctorId 
     */

    async getDoctorById(doctorId: string): Promise<IDoctor | null> {
        try {
            const doctor = await DoctorRepository.findDoctorById(doctorId);
            return doctor || null;
        } catch (error) {
            logger.error(__filename, "getDoctorById", "", "Error occurred while getting doctor by id", { error });
            throw error;
        }
    }

    /**
     * Update doctor.
     * @param doctorData 
     */
    async updateDoctor(doctorData: IDoctor): Promise<IDoctor | null> {
        try {
            const doctor = await DoctorRepository.findDoctorByIdAndUpdate(doctorData.id, doctorData
            );
            return doctor || null;
        }
        catch (error) {
            logger.error(__filename, "updateDoctor", "", "Error occurred while updating doctor", { error });
            throw error;
        }
        }
    
}

export default new PatientsService();