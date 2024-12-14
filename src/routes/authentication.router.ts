import fs from "node:fs";
import { Router } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/models/User";
import { RefreshToken } from "@/models/RefreshToken";
import logger from "@/config/logger";
import configuration from "@/config/configuration";
import AutenticationController from "@/controllers/authentication.controller";
import UsersService from "@/services/users.service";
import TokensService from "@/services/tokens.service";
import HashingService from "@/services/hashing.service";
import authenticationMiddleware from "@/middlewares/authenticate";
import authenticationRefreshTokenMiddleware from "@/middlewares/authenticate-refreshToken";
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
  String(configuration.jwt_secrets.refresh),
  refreshTokenRepository,
);
const forgotTokensService = new TokensService(
  String(configuration.jwt_secrets.forgot),
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

router.post("/register", userCreateValidator, async (req, res, next) => {
  await authenticationController.register(req, res, next);
});

router.post("/login", async (req, res, next) => {
  await authenticationController.login(req, res, next);
});

router.get("/profile", authenticationMiddleware, async (req, res, next) => {
  await authenticationController.profile(req, res, next);
});

router.post("/forgot", async (req, res, next) => {
  await authenticationController.forgot(req, res, next);
});

router.put("/reset/:token", async (req, res, next) => {
  await authenticationController.reset(req, res, next);
});

router.get(
  "/refresh",
  authenticationRefreshTokenMiddleware,
  async (req, res, next) => {
    await authenticationController.refresh(req, res, next);
  },
);

router.post("/logout", authenticationMiddleware, async (req, res, next) => {
  await authenticationController.logout(req, res, next);
});

export default router;
