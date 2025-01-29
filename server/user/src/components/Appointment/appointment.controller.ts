import { Request, Response } from "express";
import { CustomRequest } from "../../middleware/authMiddleware";
import { IAppointmentData } from "./interface/appointment.interface";
import appointmentService from "./appointment.service";
import { ResponseHandler } from "../../utils/helper";
import { IApiResponse } from "../../utils/helper/interface/responseInterface";
import { GLOBAL_MESSAGE, SUCCESS_MESSAGE } from "../../constant/message";


class AppointmentController {

    async bookAppointment(req: Request, res: Response): Promise<IApiResponse | any> {
        try {
            const customReq = req as CustomRequest;
            const userId = customReq.body.userId
            const {doctorId, slotDate, slotTime } = req.body;
            const appointmentData: IAppointmentData = {
                userId,
                doctorId,
                slotDate,
                slotTime
            }
            await appointmentService.bookAppointment(appointmentData)

            const replyFromAppointment = await appointmentService.getReplyFromAppointment();
            if (replyFromAppointment.status === "error") {
                return ResponseHandler.error(res, 500, replyFromAppointment.message, replyFromAppointment)
            }
            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.APPOINTMENT_BOOKED, replyFromAppointment)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, errorMessage)
        }
    }
}

export default new AppointmentController()