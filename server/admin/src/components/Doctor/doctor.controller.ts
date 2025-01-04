import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/helper";
import { ERROR_MESSAGE, GLOBAL_MESSAGE, RABBITMQ_QUEUE_NAME, SUCCESS_MESSAGE } from "../../constant/message";
import doctorService from "./doctor.service";
import { IApiResponse } from "../../utils/helper/interface/responseInterface";
import { IDoctorPayload, IReplayFromDoctor } from "./interface/doctor.interface";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { logger } from "../../utils/logger";


class DoctorController {

    /**
  * Handles the request to create a new Doctor.
  * @param req 
  * @param res
  */
    async createDoctor(req: Request, res: Response): Promise<IApiResponse | any> {
        try {
            const {
                firstName,
                lastName,
                email,
                password,
                specialist,
                degree,
                experience,
                about,
                fees,
                address,
            } = req.body;
            const imageFile = req.file;

            if (!imageFile) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.IMAGE_NOT_FOUND, ERROR_MESSAGE.IMAGE_NOT_FOUND)
            }
            const doctorPayload: IDoctorPayload = {
                firstName,
                lastName,
                email,
                password,
                specialist,
                degree,
                experience,
                about,
                fees,
                address,
                profilePicture: imageFile.buffer
            }
            await doctorService.createDoctor(doctorPayload);

            const replyFromDoctor = await doctorService.getReplyFromDoctor();

            if (replyFromDoctor.status === "error") {
                return ResponseHandler.error(res, 500, replyFromDoctor.message, replyFromDoctor)
            }
            return ResponseHandler.success(res, 201, SUCCESS_MESSAGE.DOCTOR_CREATED, replyFromDoctor)
        } catch (error) {
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }


}

export default new DoctorController()