import { Application } from "express";
import requestTimeout from "./requestTimeout";

export default (app: Application) => {
    app.use(requestTimeout);
}