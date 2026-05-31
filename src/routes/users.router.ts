import { Router, RequestHandler } from "express";
import UsersController from "@/controllers/users.controller";
import UsersService from "@/services/users.service";
import RestaurantsService from "@/services/restaurants.service";
import { AppDataSource } from "@/data-source";
import { User } from "@/entities/user";
import { Restaurant } from "@/entities/restaurant";
import authenticate from "@/middlewares/authenticate";
import authorization from "@/middlewares/authorization";
import logger from "@/lib/logger";
import { ROLES } from "@/lib/constants";
import { userCreateValidator } from "@/validators/users.validators";
import HashingService from "@/services/hashing.service";

const router = Router();

const usersRepository = AppDataSource.getRepository(User);
const restaurantsRepository = AppDataSource.getRepository(Restaurant);
const usersService = new UsersService(usersRepository);
const restaurantsService = new RestaurantsService(restaurantsRepository);

const hashingService = new HashingService();
const usersController = new UsersController(
  usersService,
  restaurantsService,
  hashingService,
  logger,
);

router.post(
  "/",
  authenticate,
  userCreateValidator,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await usersController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await usersController.findAll(req, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await usersController.findOne(req, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await usersController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await usersController.delete(req, res, next);
  },
);

export default router;
