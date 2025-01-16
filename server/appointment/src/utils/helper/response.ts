import { Response } from "express";
import { IApiResponse } from "./interface/responseInterface";

export class ResponseHandler {

    /**
     * Send a success response.
     * @param res - Express Response object.
     * @param statusCode - HTTP status code.
     * @param message - Success message.
     * @param data- Response payload.
     * @returns The constructed IApiResponse object.
     */

    public static success(res: Response, statusCode: number, message: string, data: [] | {} | null = null): IApiResponse {
        const response: IApiResponse = {
            statusCode,
            success: true,
            message,
            data,
            error: null,
        };
        res.status(statusCode).json(response); // Send the response.
        return response; // Return the response for typing.
    }

    /**
     * Send an error response.
     * @param res - Express Response object.
     * @param statusCode - HTTP status code.
     * @param message - Error message.
     * @param error - Error details(optional).
     * @returns The constructed IApiResponse object.
     */

    public static error(res: Response, statusCode: number, message: string, error: string | null | {} = null): IApiResponse {
        const response: IApiResponse = {
            statusCode,
            success: false,
            message,
            data: null,
            error
        };
        res.status(statusCode).json(response); // Send the response.
        return response; // Return the response for typing.
    }
}