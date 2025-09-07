import "reflect-metadata";
import { Express } from "express";
import { createServer } from "@/server.js";
import configuration from "@/lib/configuration.js";
import { AppDataSource } from "@/data-source.js";
import logger from "@/lib/logger.js";

const port = configuration.port;
const host = configuration.host;
const server: Express = createServer();

server.listen(port, host, () => {
  try {
    AppDataSource.initialize()
      .then(() => {
        logger.info(`Server Listening on  http://${host}:${port}`);
      })
      .catch((err) => {
        logger.error("Error during Data Source initialization", err);
        throw err;
      });
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
});
