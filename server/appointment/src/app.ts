import express, { Application, Request, Response } from "express";
import middleware from "./middleware";
import { logger } from "./utils/logger";
import { ResponseHandler } from "./utils/helper";
import { GLOBAL_MESSAGE } from "./constant/message";


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

middleware(app);


app.all("/*", (req: Request, res: Response): any => {
    logger.error(__filename, "Invalid Route Handler", "", "Invalid Route Fired: " + req.path, {});
    return ResponseHandler.error(res, 400, GLOBAL_MESSAGE.BAD_REQUEST, GLOBAL_MESSAGE.URL_NOT_FOUND);
})

export default app;