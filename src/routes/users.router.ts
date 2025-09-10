import { Router, RequestHandler } from "express";
import UsersController from "@/controllers/users.controller.js";
import UsersService from "@/services/users.service.js";
import RestaurantsService from "@/services/restaurants.service.js";
import { AppDataSource } from "@/data-source.js";
import { User } from "@/entities/user.js";
import { Restaurant } from "@/entities/restaurant.js";
import authenticate from "@/middlewares/authenticate.js";
import authorization from "@/middlewares/authorization.js";
import logger from "@/lib/logger.js";
import { ROLES } from "@/lib/constants.js";
import { userCreateValidator } from "@/validators/users.validators.js";

const router = Router();

const usersRepository = AppDataSource.getRepository(User);
const restaurantsRepository = AppDataSource.getRepository(Restaurant);
const usersService = new UsersService(usersRepository);
const restaurantsService = new RestaurantsService(restaurantsRepository);
const usersController = new UsersController(
  usersService,
  restaurantsService,
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
