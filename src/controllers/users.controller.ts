import { Request, Response } from "express";
import UserService from "@/services/users.service";
import RestaurantsService from "@/services/restaurants.service";
import { CreateUserDto, UpdateUserDto } from "@/dto/users";
import { Logger } from "winston";

class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly restaurantsService: RestaurantsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response) {
    const { restaurantId, ...rest } = req.body as CreateUserDto;
    const restaurant = await this.restaurantsService.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res.status(400).json({
        message: "restaurant not found",
      });
    }

    const user = await this.userService.create({
      ...rest,
      restaurant,
    });
    res.json(user);
  }

  async findAll(req: Request, res: Response) {
    const users = await this.userService.findAll();
    return res.json(users);
  }

  async findOne(req: Request, res: Response) {
    const user = await this.userService.findOne({
      where: { id: Number(req.params.id) },
    });
    res.json(user);
  }

  async update(req: Request, res: Response) {
    const { restaurantId, ...rest } = req.body as UpdateUserDto;
    const restaurant = await this.restaurantsService.findOne({
      where: { id: restaurantId },
    });
    const user = await this.userService.update(
      {
        id: Number(req.params.id),
      },
      {
        ...rest,
        restaurant: restaurant as never,
      },
    );
    res.json(user);
  }

  async delete(req: Request, res: Response) {
    const user = await this.userService.delete({ id: Number(req.params.id) });
    return res.json(user);
  }
}

export default UsersController;
