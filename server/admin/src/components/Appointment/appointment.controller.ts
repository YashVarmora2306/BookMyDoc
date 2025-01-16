import { Request, Response } from "express";
import { IApiResponse } from "../../utils/helper/interface/responseInterface";
import { CustomRequest } from "../../middleware/authMiddleware";
import appointmentService from "./appointment.service";
import { ResponseHandler } from "../../utils/helper";
import { GLOBAL_MESSAGE, SUCCESS_MESSAGE } from "../../constant/message";


class AppointmentController{

    /**
     * Handle the request to get all appointments.
     * @param req 
     * @param res 
     * @returns 
     */

    async getAllAppointment(req: Request, res: Response): Promise<IApiResponse | any>{
        try {
            const customReq = req as CustomRequest
            const replyFromAppointment = await appointmentService.getAllAppointment();
            if (replyFromAppointment.status === "error") {
                return ResponseHandler.error(res, 500, replyFromAppointment.message, replyFromAppointment)
            }
            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.APPOINTMENTS_FOUND, replyFromAppointment)
        } catch (error) {
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }
}

export default new AppointmentController()