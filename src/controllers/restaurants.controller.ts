import { Request, Response, NextFunction } from "express";
import RestaurantsService from "@/services/restaurants.service";
import { CreateRestaurantDto, UpdateRestaurantDto } from "@/dto/restaurants";
import { Logger } from "winston";

class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info(
        `Creating restaurant with data: ${JSON.stringify(req.body)}`,
      );
      const restaurant = await this.restaurantsService.create(
        req.body as CreateRestaurantDto,
      );
      this.logger.info(`Restaurant created with id: ${restaurant.id}`);
      res.json(restaurant);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error creating restaurant: ${error.message}`);
      } else {
        this.logger.error(`Unknown error: ${error as string}`);
      }
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info("Fetching all restaurants");
      const restaurants = await this.restaurantsService.findAll();
      this.logger.info(`Fetched ${restaurants.length} restaurants`);
      return res.json(restaurants);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error fetching all restaurants: ${error.message}`);
      } else {
        this.logger.error(`Unknown error: ${error as string}`);
      }
      next(error);
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
      if (error instanceof Error) {
        this.logger.error(
          `Error fetching restaurant with id: ${req.params.id}: ${error.message}`,
        );
      } else {
        this.logger.error(`Unknown error: ${error as string}`);
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info(
        `Updating restaurant with id: ${req.params.id} with data: ${JSON.stringify(
          req.body,
        )}`,
      );
      const restaurant = await this.restaurantsService.update(
        { id: Number(req.params.id) },
        req.body as UpdateRestaurantDto,
      );
      this.logger.info(`Restaurant with id: ${req.params.id} updated`);
      res.json(restaurant);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error updating restaurant with id: ${req.params.id}: ${error.message}`,
        );
      } else {
        this.logger.error(`Unknown error: ${error as string}`);
      }
      next(error);
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
      if (error instanceof Error) {
        this.logger.error(
          `Error deleting restaurant with id: ${req.params.id}: ${error.message}`,
        );
      } else {
        this.logger.error(`Unknown error: ${error as string}`);
      }
      next(error);
    }
  }
}

export default RestaurantsController;
