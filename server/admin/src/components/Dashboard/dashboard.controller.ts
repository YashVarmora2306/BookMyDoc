import { Request, Response } from "express";
import { CustomRequest } from "../../middleware/authMiddleware";
import { IApiResponse } from "../../utils/helper/interface/responseInterface";
import dashboardService from "./dashboard.service";
import { ResponseHandler } from "../../utils/helper";
import { IDashData } from "./interface/dashboard.interface";
import { GLOBAL_MESSAGE, SUCCESS_MESSAGE } from "../../constant/message";


class DashboardController {

    /**
     * Handle the request to get dashboard data.
     * @param req 
     * @param res 
     * @returns 
     */

    async getDashboardData(req: Request, res: Response): Promise<IApiResponse | any> {
        try {
            const customReq = req as CustomRequest
            const reply = await dashboardService.getAdminDashboard();
            if (reply.doctors.status === "error") {
                return ResponseHandler.error(res, 500, reply.doctors.message, reply.doctors)
            }
            if (reply.appointments.status === "error") {
                return ResponseHandler.error(res, 500, reply.appointments.message, reply.appointments)
            }
            if (reply.patients.status === "error") {
                return ResponseHandler.error(res, 500, reply.patients.message, reply.patients)
            }

            const dashData: IDashData = {
                doctors: reply.doctors.data.length,
                appointments: reply.appointments.data.length,
                patients: reply.patients.data.length,
                latestAppointments: reply.appointments.data.reverse().slice(0, 5)
            }

            return ResponseHandler.success(res, 201, SUCCESS_MESSAGE.DASH_DATA_FOUND, dashData)
        } catch (error) {
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)

        }
    }
}

export default new DashboardController();