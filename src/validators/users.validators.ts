import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const userCreateValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const validationSchema = z
    .object({
      firstname: z.string(),
      lastname: z.string(),
      email: z.string(),
      password: z.string(),
      restaurantId: z.string().optional(),
    })
    .strict();

  const queryValidationSchema = z
    .object({
      restaurantId: z.string().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
      firstname: z.string(),
      lastname: z.string(),
      email: z.string(),
    })
    .strict();
  try {
    validationSchema.parse(req.body);
    queryValidationSchema.parse(req.query);
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
};
