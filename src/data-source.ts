import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "node:path";
import configuration from "./config/configuration";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configuration.database.host,
  port: parseInt(configuration.database.port ?? "5432"),
  username: configuration.database.user,
  password: configuration.database.password,
  database: configuration.database.database,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "models/**/*.{js,ts}")],
  migrations: [path.join(__dirname, "migrations/**/*.{js,ts}")],
  subscribers: [],
});
