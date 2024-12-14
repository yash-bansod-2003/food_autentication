import { Router, RequestHandler } from "express";
import UsersController from "@/controllers/users.controller";
import UsersService from "@/services/users.service";
import RestaurantsService from "@/services/restaurants.service";
import { AppDataSource } from "@/data-source";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import authenticate from "@/middlewares/authenticate";
import authorization from "@/middlewares/authorization";
import logger from "@/config/logger";
import { ROLES } from "@/lib/constants";

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
  authorization([ROLES.ADMIN]) as RequestHandler,
  async (req, res, next) => {
    await usersController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  usersController.findAll.bind(usersController),
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  usersController.findOne.bind(usersController),
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  usersController.update.bind(usersController),
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN]) as RequestHandler,
  usersController.delete.bind(usersController),
);

export default router;
