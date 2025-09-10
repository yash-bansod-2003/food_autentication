import { Router, RequestHandler } from "express";
import RestaurantsController from "@/controllers/restaurants.controller";
import RestaurantsService from "@/services/restaurants.service";
import { AppDataSource } from "@/data-source";
import { Restaurant } from "@/entities/restaurant";
import authenticate from "@/middlewares/authenticate";
import authorization from "@/middlewares/authorization";
import logger from "@/lib/logger";
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
