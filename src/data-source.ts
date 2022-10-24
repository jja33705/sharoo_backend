import { DataSource } from "typeorm";
import { House, User } from './entity';

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_DOCKER_PORT),
    username: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [User, House],
    migrations: [],
    subscribers: [],
});

export default AppDataSource;