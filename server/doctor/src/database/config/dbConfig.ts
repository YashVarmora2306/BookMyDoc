import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',

    // using url
    url: process.env.DB_URL as string,

    /** using connection options
    host: "localhost",
    port: port,
    username: "postgres",
    password: "password",
    database: "database", */
    synchronize: false,
    logging: false,
    entities: [
        `${__dirname}/../entities/*.ts`
    ],
    // migrations: [
    //     `${__dirname}/../migrations/*.ts`
    // ],
    extra: {
        connectionTimeoutMillis: 5000,
        statement_timeout: 45000,
    },
});

export default AppDataSource;