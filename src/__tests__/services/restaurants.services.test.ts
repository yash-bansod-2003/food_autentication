import { Repository } from "typeorm";
import { Restaurant } from "@/entities/restaurant";
import RestaurantsService from "@/services/restaurants.service";

const mockRepository = {
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<Repository<Restaurant>>;

describe("RestaurantsService", () => {
  let service: RestaurantsService;

  beforeEach(() => {
    service = new RestaurantsService(mockRepository);
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("should create a restaurant", async () => {
      const createDto = { name: "Test Restaurant", address: "123 Main St" };
      const savedRestaurant = {
        id: 1,
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
        users: [],
      };

      mockRepository.save.mockResolvedValue(savedRestaurant);

      const result = await service.create(createDto);

      expect(mockRepository.save).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(savedRestaurant);
    });

    it("should create a restaurant with options", async () => {
      const createDto = {};
      const options = { reload: true };
      const savedRestaurant = {
        id: 1,
        name: "Test Restaurant",
        address: "123 Main St",
        created_at: new Date(),
        updated_at: new Date(),
        users: [],
      };

      mockRepository.save.mockResolvedValue(savedRestaurant);

      const result = await service.create(createDto, options);

      expect(mockRepository.save).toHaveBeenCalledWith(createDto, options);
      expect(result).toEqual(savedRestaurant);
    });
  });

  describe("findAll()", () => {
    it("should find all restaurants", async () => {
      const restaurants: Restaurant[] = [
        {
          id: 1,
          name: "Restaurant 1",
          address: "123 Main St",
          created_at: new Date(),
          updated_at: new Date(),
          users: [],
        },
      ];
      const total = 1;

      mockRepository.findAndCount.mockResolvedValue([restaurants, total]);

      const result = await service.findAll();

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([restaurants, total]);
    });

    it("should find all restaurants with options", async () => {
      const options = { where: { name: "Test" } };
      const restaurants: Restaurant[] = [
        {
          id: 1,
          name: "Test",
          address: "123 Main St",
          created_at: new Date(),
          updated_at: new Date(),
          users: [],
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([restaurants, 1]);

      const result = await service.findAll(options);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(options);
      expect(result).toEqual([restaurants, 1]);
    });
  });

  describe("findOne()", () => {
    it("should find one restaurant", async () => {
      const options = { where: { id: 1 } };
      const restaurant: Restaurant = {
        id: 1,
        name: "Test Restaurant",
        address: "123 Main St",
        created_at: new Date(),
        updated_at: new Date(),
        users: [],
      };

      mockRepository.findOne.mockResolvedValue(restaurant);

      const result = await service.findOne(options);

      expect(mockRepository.findOne).toHaveBeenCalledWith(options);
      expect(result).toEqual(restaurant);
    });

    it("should return null when restaurant not found", async () => {
      const options = { where: { id: 999 } };

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(options);

      expect(mockRepository.findOne).toHaveBeenCalledWith(options);
      expect(result).toBeNull();
    });
  });

  describe("update()", () => {
    it("should update a restaurant", async () => {
      const criteria = { id: 1 };
      const updateDto = { name: "Updated Restaurant" };
      const updateResult = { affected: 1, generatedMaps: [], raw: {} };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(criteria, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(criteria, updateDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe("delete()", () => {
    it("should delete a restaurant", async () => {
      const criteria = { id: 1 };
      const deleteResult = { affected: 1, raw: {} };

      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(criteria);

      expect(mockRepository.delete).toHaveBeenCalledWith(criteria);
      expect(result).toEqual(deleteResult);
    });
  });
});
