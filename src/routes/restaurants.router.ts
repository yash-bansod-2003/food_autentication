/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import RestaurantsController from "@/controllers/restaurants.controller";
import RestaurantsService from "@/services/restaurants.service";
import { AppDataSource } from "@/data-source";
import { Restaurant } from "@/entity/Restaurant";
import authenticate from "@/middlewares/authenticate";
import authorization from "@/middlewares/authorization";
import logger from "@/config/logger";
import { ROLES } from "@/lib/constants";

const router = Router();

const usersRepository = AppDataSource.getRepository(Restaurant);
const restaurantsService = new RestaurantsService(usersRepository);
const restaurantsController = new RestaurantsController(
  restaurantsService,
  logger,
);
import { restaurantCreateValidator } from "@/validators/restaurants.validator";

router.post(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]),
  restaurantCreateValidator,
  restaurantsController.create.bind(restaurantsController),
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]),
  restaurantsController.findAll.bind(restaurantsController),
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]),
  restaurantsController.findOne.bind(restaurantsController),
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]),
  restaurantsController.update.bind(restaurantsController),
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]),
  restaurantsController.delete.bind(restaurantsController),
);

export default router;
