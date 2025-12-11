import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const restaurantValidationSchema = z.object({
  name: z.string(),
});

export const restaurantQueryValidationSchema = z.object({
  page: z.number().optional(),
  per_page: z.number().optional(),
});

export const restaurantCreateValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    restaurantValidationSchema.parse(req.body);
    restaurantQueryValidationSchema.parse(req.query);
    return next();
  } catch (error) {
    return next(error);
  }
};
