import "reflect-metadata";
import express, { ErrorRequestHandler, Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usersRouter from "@/routes/users.router";
import authRouter from "@/routes/authentication.router";
import restaurantsRouter from "@/routes/restaurants.router";
import errorHandler from "@/middlewares/error-handler";

export const createServer = (): Express => {
  const app = express();
  app
    .use(
      cors({
        origin: ["http://localhost:5173", "http://localhost:4173"],
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
