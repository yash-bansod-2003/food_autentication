import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import RestaurantsController from "@/controllers/restaurants.controller";
import RestaurantsService from "@/services/restaurants.service";
import createHttpError from "http-errors";

const mockRestaurantsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<RestaurantsService>;

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as jest.Mocked<Logger>;

describe("RestaurantsController", () => {
  let controller: RestaurantsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    controller = new RestaurantsController(mockRestaurantsService, mockLogger);
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("should create a restaurant successfully", async () => {
      const restaurantData = {
        name: "Test Restaurant",
        address: "123 Main St",
      };
      const createdRestaurant = {
        id: 1,
        ...restaurantData,
        created_at: new Date(),
        updated_at: new Date(),
        users: [],
      };

      mockRequest.body = restaurantData;
      mockRestaurantsService.create.mockResolvedValue(createdRestaurant);

      await controller.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockLogger.info).toHaveBeenCalledWith(
        `Creating restaurant with data: ${JSON.stringify(restaurantData)}`,
      );
      expect(mockRestaurantsService.create).toHaveBeenCalledWith(
        restaurantData,
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        `Restaurant created with id: ${createdRestaurant.id}`,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: createdRestaurant,
        success: true,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle errors when creating a restaurant", async () => {
      const restaurantData = {
        name: "Test Restaurant",
        address: "123 Main St",
      };
      const error = new Error("Database error");

      mockRequest.body = restaurantData;
      mockRestaurantsService.create.mockRejectedValue(error);

      await controller.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error creating restaurant: ${error.message}`,
      );
      expect(mockNext).toHaveBeenCalledWith(
        createHttpError(500, "Error creating restaurant"),
      );
    });
  });

  describe("findAll()", () => {
    it("should fetch all restaurants with default pagination", async () => {
      const restaurants = [
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

      mockRequest.query = {};
      mockRestaurantsService.findAll.mockResolvedValue([restaurants, total]);

      await controller.findAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRestaurantsService.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          page: 1,
          per_page: 10,
          total: total,
        },
        data: restaurants,
        success: true,
      });
    });

    it("should fetch all restaurants with custom pagination", async () => {
      const restaurants = [];
      const total = 0;

      mockRequest.query = { page: "2", per_page: "5" };
      mockRestaurantsService.findAll.mockResolvedValue([restaurants, total]);

      await controller.findAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRestaurantsService.findAll).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          page: 2,
          per_page: 5,
          total: total,
        },
        data: restaurants,
        success: true,
      });
    });

    it("should handle errors when fetching all restaurants", async () => {
      const error = new Error("Database error");

      mockRequest.query = {};
      mockRestaurantsService.findAll.mockRejectedValue(error);

      await controller.findAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error fetching all restaurants: ${error.message}`,
      );
      expect(mockNext).toHaveBeenCalledWith(
        createHttpError(500, "Error fetching all restaurants"),
      );
    });
  });

  describe("findOne()", () => {
    it("should fetch a restaurant by id", async () => {
      const restaurant = {
        id: 1,
        name: "Test Restaurant",
        address: "123 Main St",
        created_at: new Date(),
        updated_at: new Date(),
        users: [],
      };

      mockRequest.params = { id: "1" };
      mockRestaurantsService.findOne.mockResolvedValue(restaurant);

      await controller.findOne(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRestaurantsService.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: restaurant,
        success: true,
      });
    });

    it("should return 404 when restaurant not found", async () => {
      mockRequest.params = { id: "999" };
      mockRestaurantsService.findOne.mockResolvedValue(null);

      await controller.findOne(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Restaurant not found",
      });
    });

    it("should handle errors when fetching a restaurant", async () => {
      const error = new Error("Database error");

      mockRequest.params = { id: "1" };
      mockRestaurantsService.findOne.mockRejectedValue(error);

      await controller.findOne(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error fetching restaurant with id: 1: ${error.message}`,
      );
      expect(mockNext).toHaveBeenCalledWith(
        createHttpError(404, "Restaurant not found"),
      );
    });
  });

  describe("update()", () => {
    it("should update a restaurant successfully", async () => {
      const updateData = {
        name: "Updated Restaurant",
        address: "456 Updated St",
      };
      const updateResult = { affected: 1, generatedMaps: [], raw: {} };
      const updatedRestaurant = {
        id: 1,
        name: "Updated Restaurant",
        address: "456 Updated St",
        created_at: new Date(),
        updated_at: new Date(),
        users: [],
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = updateData;
      mockRestaurantsService.update.mockResolvedValue(updateResult);
      mockRestaurantsService.findOne.mockResolvedValue(updatedRestaurant);

      await controller.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRestaurantsService.update).toHaveBeenCalledWith(
        { id: 1 },
        updateData,
      );
      expect(mockRestaurantsService.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: updatedRestaurant,
        success: true,
      });
    });

    it("should handle errors when updating a restaurant", async () => {
      const updateData = {
        name: "Updated Restaurant",
        address: "456 Updated St",
      };
      const error = new Error("Database error");

      mockRequest.params = { id: "1" };
      mockRequest.body = updateData;
      mockRestaurantsService.update.mockRejectedValue(error);

      await controller.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error updating restaurant with id: 1: ${error.message}`,
      );
      expect(mockNext).toHaveBeenCalledWith(
        createHttpError(500, "Error updating restaurant"),
      );
    });
  });

  describe("delete()", () => {
    it("should delete a restaurant successfully", async () => {
      const deleteResult = { affected: 1, raw: {} };

      mockRequest.params = { id: "1" };
      mockRestaurantsService.delete.mockResolvedValue(deleteResult);

      await controller.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRestaurantsService.delete).toHaveBeenCalledWith({ id: 1 });
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: { affected: deleteResult.affected },
        success: true,
      });
    });

    it("should handle errors when deleting a restaurant", async () => {
      const error = new Error("Database error");

      mockRequest.params = { id: "1" };
      mockRestaurantsService.delete.mockRejectedValue(error);

      await controller.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error deleting restaurant with id: 1: ${error.message}`,
      );
      expect(mockNext).toHaveBeenCalledWith(
        createHttpError(500, "Error deleting restaurant"),
      );
    });
  });
});
