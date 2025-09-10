import { Request, Response, NextFunction } from "express";
import RestaurantsService from "@/services/restaurants.service";
import { Restaurant } from "@/types/index";
import { Logger } from "winston";
import createHttpError from "http-errors";

class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const restaurantData = req.body as Restaurant;
    try {
      this.logger.info(
        `Creating restaurant with data: ${JSON.stringify(restaurantData)}`,
      );
      const restaurant = await this.restaurantsService.create(restaurantData);
      this.logger.info(`Restaurant created with id: ${restaurant.id}`);
      res.json(restaurant);
    } catch (error: unknown) {
      this.logger.error(
        `Error creating restaurant: ${(error as Error).message}`,
      );
      next(createHttpError(500, "Error creating restaurant"));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;
    try {
      this.logger.info("Fetching all restaurants");
      const [restaurants, total] = await this.restaurantsService.findAll({
        skip,
        take: limit,
      });
      this.logger.info(`Fetched ${restaurants.length} restaurants`);
      return res.json({ page, limit, total, data: restaurants });
    } catch (error: unknown) {
      this.logger.error(
        `Error fetching all restaurants: ${(error as Error).message}`,
      );
      next(createHttpError(500, "Error fetching all restaurants"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info(`Fetching restaurant with id: ${req.params.id}`);
      const restaurant = await this.restaurantsService.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!restaurant) {
        this.logger.info(`Restaurant with id: ${req.params.id} not found`);
        return res.status(404).json({ message: "Restaurant not found" });
      }
      this.logger.info(`Fetched restaurant with id: ${restaurant.id}`);
      res.json(restaurant);
    } catch (error: unknown) {
      this.logger.error(
        `Error fetching restaurant with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(404, "Restaurant not found"));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const restaurantData = req.body as Restaurant;
    try {
      this.logger.info(
        `Updating restaurant with id: ${req.params.id} with data: ${JSON.stringify(
          restaurantData,
        )}`,
      );
      const restaurant = await this.restaurantsService.update(
        { id: Number(req.params.id) },
        restaurantData,
      );
      this.logger.info(`Restaurant with id: ${req.params.id} updated`);
      res.json(restaurant);
    } catch (error: unknown) {
      this.logger.error(
        `Error updating restaurant with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "Error updating restaurant"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info(`Deleting restaurant with id: ${req.params.id}`);
      const restaurant = await this.restaurantsService.delete({
        id: Number(req.params.id),
      });
      this.logger.info(`Restaurant with id: ${req.params.id} deleted`);
      return res.json(restaurant);
    } catch (error: unknown) {
      this.logger.error(
        `Error deleting restaurant with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "Error deleting restaurant"));
    }
  }
}

export default RestaurantsController;
