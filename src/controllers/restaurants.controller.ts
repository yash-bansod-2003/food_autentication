import { Request, Response } from "express";
import RestaurantsService from "@/services/restaurants.service";
import { CreateRestaurantDto, UpdateRestaurantDto } from "@/dto/restaurants";
import { Logger } from "winston";

class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response) {
    const user = await this.restaurantsService.create(
      req.body as CreateRestaurantDto,
    );
    res.json(user);
  }

  async findAll(req: Request, res: Response) {
    const restaurants = await this.restaurantsService.findAll();
    return res.json(restaurants);
  }

  async findOne(req: Request, res: Response) {
    const restaurants = await this.restaurantsService.findOne({
      where: { id: Number(req.params.id) },
    });
    res.json(restaurants);
  }

  async update(req: Request, res: Response) {
    const restaurant = await this.restaurantsService.update(
      { id: Number(req.params.id) },
      req.body as UpdateRestaurantDto,
    );
    res.json(restaurant);
  }

  async delete(req: Request, res: Response) {
    const restaurant = await this.restaurantsService.delete({
      id: Number(req.params.id),
    });
    return res.json(restaurant);
  }
}

export default RestaurantsController;
