import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const userValidationSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    password: z.string(),
    restaurantId: z.number().optional(),
  })
  .strict();

export const userQueryValidationSchema = z
  .object({
    restaurantId: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    search: z.string().optional(),
    role: z.string().optional(),
  })
  .strict();

export const userCreateValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    userValidationSchema.parse(req.body);
    userQueryValidationSchema.parse(req.query);
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
};
