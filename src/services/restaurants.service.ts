import { Restaurant } from "@/entities/restaurant";
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class RestaurantsService {
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

  /**
   *
   * @returns A QueryBuilder for the User entity, allowing for complex queries to be built.
   * This can be used to perform operations like joins, where conditions, and more.
   */
  getQueryBuilder(alias: string): SelectQueryBuilder<Restaurant> {
    return this.restaurantsRepository.createQueryBuilder(alias);
  }
}

export default RestaurantsService;
