/* eslint-disable @typescript-eslint/no-misused-promises */
import fs from "node:fs";
import { Router } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { RefreshToken } from "@/entity/RefreshToken";
import logger from "@/config/logger";
import configuration from "@/config/configuration";
import AutenticationController from "@/controllers/authentication.controller";
import UsersService from "@/services/users.service";
import TokensService from "@/services/tokens.service";
import HashingService from "@/services/hashing.service";
import authenticationMiddleware from "@/middlewares/authenticate";
import { userCreateValidator } from "@/validators/users.validators";

const router = Router();

const usersRepository = AppDataSource.getRepository(User);
let privateKey: Buffer | string;
try {
  privateKey = fs.readFileSync("certificates/private.pem");
} catch (error) {
  privateKey = "";
  logger.error(error);
}

const hashingService = new HashingService();

const accessTokensService = new TokensService(privateKey);

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const refreshTokensService = new TokensService(
  configuration.jwt_secrets.refresh!,
  refreshTokenRepository,
);
const forgotTokensService = new TokensService(
  configuration.jwt_secrets.forgot!,
);
const usersService = new UsersService(usersRepository);
const authenticationController = new AutenticationController(
  usersService,
  hashingService,
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
