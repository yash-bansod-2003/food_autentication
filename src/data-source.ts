import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "node:path";
import configuration from "@/lib/configuration.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configuration.database.host,
  port: configuration.port,
  username: configuration.database.user,
  password: configuration.database.password,
  database: configuration.database.database,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, "models/**/*.{js,ts}")],
  migrations: [path.join(__dirname, "migrations/**/*.{js,ts}")],
  subscribers: [],
});
