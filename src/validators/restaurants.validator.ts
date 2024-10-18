import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const restaurantCreateValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validationSchema = z.object({
    name: z.string(),
  });
  try {
    validationSchema.parse(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};
