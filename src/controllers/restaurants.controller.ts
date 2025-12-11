import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";

import { Restaurant, ResponseWithMetadata } from "@/types/index";
import RestaurantsService from "@/services/restaurants.service";
import { restaurantQueryValidationSchema } from "@/validators/restaurants.validator";
import z from "zod";

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
      const response: ResponseWithMetadata<Restaurant> = {
        data: restaurant,
        success: true,
      };
      res.json(response);
    } catch (error: unknown) {
      this.logger.error(
        `Error creating restaurant: ${(error as Error).message}`,
      );
      next(createHttpError(500, "Error creating restaurant"));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const query = req.query as z.infer<typeof restaurantQueryValidationSchema>;
    const page = query.page ? Number(query.page) : 1;
    const per_page = query.per_page ? Number(query.per_page) : 10;
    const skip = (page - 1) * per_page;
    try {
      this.logger.info("Fetching all restaurants");
      const [restaurants, total] = await this.restaurantsService.findAll({
        skip,
        take: per_page,
      });
      this.logger.info(`Fetched ${restaurants.length} restaurants`);
      const response: ResponseWithMetadata<Restaurant[]> = {
        meta: {
          page,
          per_page,
          total,
        },
        data: restaurants,
        success: true,
      };
      return res.json(response);
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
      const response: ResponseWithMetadata<Restaurant> = {
        data: restaurant,
        success: true,
      };
      this.logger.info(`Fetched restaurant with id: ${restaurant.id}`);
      res.json(response);
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
      await this.restaurantsService.update(
        { id: Number(req.params.id) },
        restaurantData,
      );
      this.logger.info(`Restaurant with id: ${req.params.id} updated`);

      const updatedRestaurant = await this.restaurantsService.findOne({
        where: { id: Number(req.params.id) },
      });

      if (!updatedRestaurant) {
        this.logger.error(
          `Restaurant with id: ${req.params.id} not found after update`,
        );
        return next(createHttpError(500, "internal server error"));
      }

      const response: ResponseWithMetadata<typeof updatedRestaurant> = {
        data: updatedRestaurant,
        success: true,
      };
      res.json(response);
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
      const result = await this.restaurantsService.delete({
        id: Number(req.params.id),
      });
      this.logger.info(`Restaurant with id: ${req.params.id} deleted`);
      const response: ResponseWithMetadata<{
        affected: number | null | undefined;
      }> = {
        data: { affected: result.affected },
        success: true,
      };
      return res.json(response);
    } catch (error: unknown) {
      this.logger.error(
        `Error deleting restaurant with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "Error deleting restaurant"));
    }
  }
}

export default RestaurantsController;
