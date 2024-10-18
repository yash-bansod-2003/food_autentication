import { Request, Response, NextFunction } from "express";
import UserService from "@/services/users.service";
import RestaurantsService from "@/services/restaurants.service";
import { CreateUserDto, UpdateUserDto } from "@/dto/users";
import { Logger } from "winston";
import createHttpError from "http-errors";

class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly restaurantsService: RestaurantsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Creating user with data: ${JSON.stringify(req.body)}`);
    const { restaurantId, ...rest } = req.body as CreateUserDto;
    const restaurant = await this.restaurantsService.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      this.logger.error(`Restaurant with id: ${restaurantId} not found`);
      return next(createHttpError(400, "restaurant not found"));
    }

    try {
      const user = await this.userService.create({
        ...rest,
        restaurant,
      });
      this.logger.info(`User created with id: ${user.id}`);
      res.json(user);
    } catch (error) {
      this.logger.error(`Error creating user: ${(error as Error).message}`);
      next(createHttpError(500, "internal server error"));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    this.logger.info("Fetching all users");
    try {
      const users = await this.userService.findAll();
      this.logger.info(`Fetched ${users.length} users`);
      return res.json(users);
    } catch (error) {
      this.logger.error(
        `Error fetching all users: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Fetching user with id: ${req.params.id}`);
    try {
      const user = await this.userService.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!user) {
        this.logger.error(`User with id: ${req.params.id} not found`);
        return next(createHttpError(404, "user not found"));
      }
      this.logger.info(`Fetched user with id: ${user.id}`);
      res.json(user);
    } catch (error) {
      this.logger.error(
        `Error fetching user with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    this.logger.info(
      `Updating user with id: ${req.params.id} with data: ${JSON.stringify(req.body)}`,
    );
    const { restaurantId, ...rest } = req.body as UpdateUserDto;
    const restaurant = await this.restaurantsService.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      this.logger.error(`Restaurant with id: ${restaurantId} not found`);
      return next(createHttpError(400, "restaurant not found"));
    }

    try {
      const user = await this.userService.update(
        {
          id: Number(req.params.id),
        },
        {
          ...rest,
          restaurant: restaurant as never,
        },
      );
      this.logger.info(`User with id: ${req.params.id} updated`);
      res.json(user);
    } catch (error) {
      this.logger.error(
        `Error updating user with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Deleting user with id: ${req.params.id}`);
    try {
      const user = await this.userService.delete({ id: Number(req.params.id) });
      this.logger.info(`User with id: ${req.params.id} deleted`);
      return res.json(user);
    } catch (error) {
      this.logger.error(
        `Error deleting user with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default UsersController;
