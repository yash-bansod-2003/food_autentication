/* eslint-disable @typescript-eslint/no-misused-promises */
import fs from "node:fs";
import { Router } from "express";
import AutenticationController from "@/controllers/authentication.controller";
import UsersService from "@/services/users.service";
import TokensService from "@/services/tokens.service";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import authenticationMiddleware from "@/middlewares/authenticate";
import { userCreateValidator } from "@/validators/users.validators";
import logger from "@/config/logger";
import configuration from "@/config/configuration";

const router = Router();

const usersRepository = AppDataSource.getRepository(User);
const privateKey = fs.readFileSync("certificates/private.pem");
const accessTokensService = new TokensService(privateKey, {
  algorithm: "RS256",
  expiresIn: "1h",
  issuer: "food_authentication",
});
const refreshTokensService = new TokensService(
  configuration.jwt_secrets.refresh!,
);
const forgotTokensService = new TokensService(
  configuration.jwt_secrets.forgot!,
);
const usersService = new UsersService(usersRepository);
const authenticationController = new AutenticationController(
  usersService,
  accessTokensService,
  refreshTokensService,
  forgotTokensService,
  logger,
);

router.post(
  "/register",
  userCreateValidator,
  authenticationController.register.bind(authenticationController),
);

router.post(
  "/login",
  authenticationController.login.bind(authenticationController),
);

router.get(
  "/profile",
  authenticationMiddleware,
  authenticationController.profile.bind(authenticationController),
);

router.post(
  "/forgot",
  authenticationController.forgot.bind(authenticationController),
);

router.put(
  "/reset/:token",
  authenticationController.reset.bind(authenticationController),
);

export default router;
