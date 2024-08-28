import express, { type Express } from "express";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      res.json({ message: `hello ${req.params.name}` });
    });

  return app;
};
