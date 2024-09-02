import { type Express } from "express";
import { createServer } from "@/server";
import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });

const port = parseInt(process.env.port!) ?? 5000;
const host = process.env.host ?? "localhost";

const server: Express = createServer();

server.listen(port, host, () => {
  try {
    console.log(`Server Listening on port ${port}`);
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
});
