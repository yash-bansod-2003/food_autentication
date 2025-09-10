import "reflect-metadata";
import express, { ErrorRequestHandler, Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usersRouter from "@/routes/users.router.js";
import authRouter from "@/routes/authentication.router.js";
import restaurantsRouter from "@/routes/restaurants.router.js";
import errorHandler from "@/middlewares/error-handler.js";
import configuration from "@/lib/configuration.js";

export const createServer = (): Express => {
  const app = express();
  app
    .use(
      cors({
        origin: [configuration.cookies.domain],
        credentials: true,
      }),
    )
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(morgan("dev"))
    .use(cookieParser())
    .use(express.static("public"))
    .get("/status", (_, res) => {
      res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      res.json({ message: `hello ${req.params.name}` });
    })
    .use("/auth", authRouter)
    .use("/users", usersRouter)
    .use("/restaurants", restaurantsRouter)
    .use(errorHandler as unknown as ErrorRequestHandler);
  return app;
};
