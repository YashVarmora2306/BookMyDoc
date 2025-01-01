import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DB_URL as string,
    synchronize: false,
    logging: true,
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