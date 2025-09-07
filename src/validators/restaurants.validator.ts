import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const restaurantValidationSchema = z.object({
  name: z.string(),
});

export const restaurantCreateValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    restaurantValidationSchema.parse(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};
