import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import UserService from "@/services/users.service";
import RestaurantsService from "@/services/restaurants.service";
import { User, ResponseWithMetadata } from "@/types/index";
import {
  userQueryValidationSchema,
  userValidationSchema,
} from "@/validators/users.validators";
import { z } from "zod";
import { ROLES } from "@/lib/constants";
import HashingService from "@/services/hashing.service";

class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly restaurantsService: RestaurantsService,
    private readonly hashingService: HashingService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const body = req.body as z.infer<typeof userValidationSchema>;
    this.logger.info(`Creating user with email: ${body.email}`);
    const { restaurantId, password, ...rest } = body;

    const restaurant = await this.restaurantsService.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      this.logger.error(`Restaurant with id: ${restaurantId} not found`);
      next(createHttpError(400, "restaurant not found"));
      return;
    }

    try {
      this.logger.debug("creating hash of the password");
      const passwordHash = await this.hashingService.hash(password);

      const user = await this.userService.create({
        ...rest,
        role: ROLES.USER,
        password: passwordHash,
        restaurant,
      });
      this.logger.info(`User created with id: ${user.id}`);
      const response: ResponseWithMetadata<User> = {
        data: user,
        success: true,
      };
      res.json(response);
      return;
    } catch (error) {
      this.logger.error(`Error creating user: ${(error as Error).message}`);
      next(createHttpError(500, "internal server error"));
      return;
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const query = req.query as unknown as z.infer<
      typeof userQueryValidationSchema
    >;

    const page = query.page ? Number(query.page) : 1;
    const limit = query.per_page ? Number(query.per_page) : 10;
    const skip = (page - 1) * limit;

    try {
      const queryBuilder = this.userService.getQueryBuilder("user");

      /*
      Okay if you wonder the CONCAT will be help to search for users by their full name like 'Yash Bansod' will return users with firstname 'Yash' and lastname 'Bansod' or vice versa 
      */
      if (query.search) {
        queryBuilder.where(
          "(LOWER(user.firstname) LIKE LOWER(:search) OR LOWER(user.lastname) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search) OR LOWER(CONCAT(user.firstname, ' ', user.lastname)) LIKE LOWER(:search))",
          {
            search: `%${query.search}%`,
          },
        );
      }

      if (query.role) {
        queryBuilder.andWhere("user.role = :role", { role: query.role });
      }

      this.logger.debug(`User query params: ${JSON.stringify(query, null, 2)}`);

      const [users, total] = await queryBuilder
        .leftJoinAndSelect("user.restaurant", "restaurant")
        .skip(skip)
        .take(limit)
        .orderBy("user.id", "DESC")
        .getManyAndCount();

      const response: ResponseWithMetadata<User[]> = {
        meta: {
          page,
          per_page: limit,
          total,
        },
        data: users.map((user) => ({ ...user, password: undefined })),
        success: true,
      };

      this.logger.info(`Fetched ${users.length} users`);
      return res.json(response);
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
        select: {
          password: false,
        },
      });
      if (!user) {
        this.logger.error(`User with id: ${req.params.id} not found`);
        return next(createHttpError(404, "user not found"));
      }
      const response: ResponseWithMetadata<User> = {
        data: user,
        success: true,
      };
      this.logger.info(`Fetched user with id: ${user.id}`);
      res.json(response);
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
    const { restaurantId, ...rest } = req.body as User;
    const restaurant = await this.restaurantsService.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      this.logger.error(`Restaurant with id: ${restaurantId} not found`);
      return next(createHttpError(400, "restaurant not found"));
    }

    try {
      await this.userService.update(
        {
          id: Number(req.params.id),
        },
        {
          ...rest,
          restaurant: restaurant as never,
        },
      );
      this.logger.info(`User with id: ${req.params.id} updated`);

      const updatedUser = await this.userService.findOne({
        where: { id: Number(req.params.id) },
        select: {
          password: false,
        },
      });

      if (!updatedUser) {
        this.logger.error(
          `User with id: ${req.params.id} not found after update`,
        );
        return next(createHttpError(500, "internal server error"));
      }

      const response: ResponseWithMetadata<typeof updatedUser> = {
        data: updatedUser,
        success: true,
      };
      res.json(response);
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
      const result = await this.userService.delete({
        id: Number(req.params.id),
      });
      this.logger.info(`User with id: ${req.params.id} deleted`);
      const response: ResponseWithMetadata<{
        affected: number | null | undefined;
      }> = {
        data: { affected: result.affected },
        success: true,
      };
      return res.json(response);
    } catch (error) {
      this.logger.error(
        `Error deleting user with id: ${req.params.id}: ${(error as Error).message}`,
      );
      next(createHttpError(500, "internal server error"));
    }
  }
}

export default UsersController;
