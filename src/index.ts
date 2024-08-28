import { type Express } from "express";
import { createServer } from "@/server";

const host = "localhost";
const port = 3000;

const server: Express = createServer();

server.listen(port, host, () => {
  try {
    console.log(`Server Listening on port ${port}`);
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
});
