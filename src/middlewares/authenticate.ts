import fs from "node:fs";
import { Request, Response, NextFunction } from "express";
import TokensService from "@/services/tokens.service";
import createHttpError from "http-errors";
import logger from "@/config/logger";

let privateKey: Buffer | string;
try {
  privateKey = fs.readFileSync("certificates/private.pem");
} catch (error) {
  privateKey = "";
  logger.error(error);
}
const accessTokensService = new TokensService(privateKey, {
  algorithm: "RS256",
  expiresIn: "1h",
  issuer: "food_authentication",
});
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authenticationHeader = req.headers.authorization;
  const authenticationToken = authenticationHeader?.split(" ")[1];
  if (!authenticationToken) {
    return next(createHttpError.Unauthorized());
  }
  const match = accessTokensService.verify(authenticationToken);
  if (!match) {
    return next(createHttpError.Unauthorized());
  }
  req["user"] = match;
  next();
};

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    role: string;
    restaurantId: number;
    iat: number;
    exp: number;
  };
}

export default authenticate;
