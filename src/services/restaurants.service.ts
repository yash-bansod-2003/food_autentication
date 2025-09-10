import { Restaurant } from "@/entities/restaurant.js";
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

class UserService {
  constructor(private readonly restaurantsRepository: Repository<Restaurant>) {}
  async create(
    createRestaurantDto: DeepPartial<Restaurant>,
    options?: SaveOptions,
  ) {
    return await this.restaurantsRepository.save(createRestaurantDto, options);
  }

  findAll(
    options?: FindManyOptions<Restaurant>,
  ): Promise<[Restaurant[], number]> {
    return this.restaurantsRepository.findAndCount(options);
  }

  findOne(options: FindOneOptions<Restaurant>): Promise<Restaurant | null> {
    return this.restaurantsRepository.findOne(options);
  }

  update(
    criteria: FindOptionsWhere<Restaurant>,
    updateRestaurantDto: QueryDeepPartialEntity<Restaurant>,
  ): Promise<UpdateResult> {
    return this.restaurantsRepository.update(criteria, updateRestaurantDto);
  }

  delete(criteria: FindOptionsWhere<Restaurant>): Promise<DeleteResult> {
    return this.restaurantsRepository.delete(criteria);
  }
}

export default UserService;
