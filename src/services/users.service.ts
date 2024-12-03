import { User } from "@/models/User";
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
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class UsersService {
  constructor(private readonly usersRepository: Repository<User>) {}
  /**
   * Create a new user in the database.
   *
   * @param createUserDto The User to be created, without an id.
   * @param options The options to be passed to the save method of the repository.
   * @returns A Promise that resolves to the created User.
   */
  async create(createUserDto: DeepPartial<User>, options?: SaveOptions) {
    return await this.usersRepository.save(createUserDto, options);
  }

  /**
   * Retrieve all users from the database.
   *
   * @param options The options to be passed to the find method of the repository.
   * @returns A Promise that resolves to an array of User objects.
   */
  findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.find(options);
  }

  /**
   * Retrieve a single user from the database.
   *
   * @param options The options to be passed to the findOne method of the repository.
   * @returns A Promise that resolves to the User, or null if no User matches the criteria.
   */
  findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.usersRepository.findOne(options);
  }

  /**
   * Update a user in the database.
   *
   * @param criteria The criteria to search for the user to be updated.
   * @param userUpdateDto The User object with the changes to be applied.
   * @returns A Promise that resolves to the result of the update operation.
   */
  update(
    criteria: FindOptionsWhere<User>,
    userUpdateDto: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    return this.usersRepository.update(criteria, userUpdateDto);
  }

  /**
   * Delete a user from the database.
   *
   * @param criteria The criteria to search for the user to be deleted.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  delete(criteria: FindOptionsWhere<User>): Promise<DeleteResult> {
    return this.usersRepository.delete(criteria);
  }
}

export default UsersService;
