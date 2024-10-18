import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usersRouter from "@/routes/users.router";
import authRouter from "@/routes/authentication.router";
import restaurantsRouter from "@/routes/restaurants.router";

export const createServer = (): Express => {
  const app = express();
  app
    .use(cors({ origin: ["http://localhost:5173"], credentials: true }))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(morgan("dev"))
    .use(cookieParser())
    .use(express.static("public"))
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      res.json({ message: `hello ${req.params.name}` });
    })
    .use("/auth", authRouter)
    .use("/users", usersRouter)
    .use("/restaurants", restaurantsRouter);

  return app;
};
