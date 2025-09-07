import { Router, RequestHandler } from "express";
import RestaurantsController from "@/controllers/restaurants.controller.js";
import RestaurantsService from "@/services/restaurants.service.js";
import { AppDataSource } from "@/data-source.js";
import { Restaurant } from "@/models/restaurant.js";
import authenticate from "@/middlewares/authenticate.js";
import authorization from "@/middlewares/authorization.js";
import logger from "@/lib/logger.js";
import { ROLES } from "@/lib/constants.js";

const router = Router();

const usersRepository = AppDataSource.getRepository(Restaurant);
const restaurantsService = new RestaurantsService(usersRepository);
const restaurantsController = new RestaurantsController(
  restaurantsService,
  logger,
);
import { restaurantCreateValidator } from "@/validators/restaurants.validator.js";

router.post(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  restaurantCreateValidator,
  async (req, res, next) => {
    await restaurantsController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await restaurantsController.findAll(req, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await restaurantsController.findOne(req, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await restaurantsController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await restaurantsController.delete(req, res, next);
  },
);

export default router;
