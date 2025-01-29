import moment from "moment";
import path from "path";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, printf } = format;

const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

class Logging {
    public logger: any;

    /**
     * creates an instance of Logging.
     */

    public transport = new transports.DailyRotateFile({
        filename: `./logs/${date}/%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "7d",
    });

    public myFormat = printf(({
        level, message
    }) => {
        return `${moment.utc().format()} ${level}: ${message}`;
    });

    /**
     * Creates an instance of Logging.
     */

    constructor() {
        this.logger = createLogger({
            format: combine(format.timestamp(), format.json()),
            transports: [
                this.transport,
                new transports.Console({
                    format: format.combine(format.colorize(), this.myFormat),
                }),
            ],
        });
    }

    /**
     * This function is used to get the label of the file.
     * @param {string} fileName
     */

    public getLabel(fileName: string) {
        const parts = fileName.split(path.sep);
        return parts[parts.length - 2] + "/" + parts.pop();
    }

    /**
     * This function is used to set the label of the file.
     * @param {string} fileName
     * @param method
     * @returns
     */

    public setLabel(fileName: string, method: string) {
        let label = this.getLabel(fileName);
        label += method ? `~${method}` : '';
        return label;
    }

    // Public method for external use

    /**
    * Common parameters used in the logging methods.
    * @param fileName - The file name where the log is generated.
    * @param method - The method name where the log is triggered.
    * @param uuid - A unique identifier for tracking logs (e.g., request ID).
    * @param message - A description of the log message.
    * @param data - Optional additional data associated with the log.
    */

    /**
     * Log the error message.
     * Common parameters.
     */

    public error(fileName: string, method: string, uuid: string, message: string, data: any = {}) {
        this.logger.error(`[${this.setLabel(fileName, method)}] ${uuid} -${message}`, data ? data : '', '')
    }

    /**
     * Log the warning message.
     * Common Parameters.
     */

    public warn(fileName: string, method: string, uuid: string, message: string, data: any = {}) {
        this.logger.warn(`[${this.setLabel(fileName, method)}] ${uuid} -${message}`, data ? data : '', '')
    }

    /**
     * Log the information message.
     * Common Parameters.
     */

    public info(fileName: string, method: string, uuid: string, message: string, data: any = {}) {
        this.logger.info(`[${this.setLabel(fileName, method)}] ${uuid} -${message}`, data ? data : '', '')
    }

    /**
     * Log the debugging message.
     * Common Parameters.
     */

    public debug(fileName: string, method: string, uuid: string, message: string, data: any = {}) {
        this.logger.debug(`[${this.setLabel(fileName, method)}] ${uuid} -${message}`, data ? data : '', '')
    }

    /**
     * Log the verbose message.
     * Common Parameters.
     */

    public verbose(fileName: string, method: string, uuid: string, message: string, data: any = {}) {
        this.logger.verbose(`[${this.setLabel(fileName, method)}] ${uuid} -${message}`, data ? data : '', '')
    }

    /**
     * Log the silly message.
     * Common Parameters.
     */

    public silly(fileName: string, method: string, uuid: string, message: string, data: any = {}) {
        this.logger.silly(`[${this.setLabel(fileName, method)}] ${uuid} -${message}`, data ? data : '', '')
    }
}

const logger = new Logging();

export default logger;