import {
  expect,
  describe,
  jest,
  beforeEach,
  afterEach,
  test,
} from "@jest/globals";
import { faker } from "@faker-js/faker";
import { MockCategoryRepository } from "../../database/repository/mock/mock-category-repository";
import { CategoryService } from "../category-service";
import { FormateData } from "../../utils";
import { Factory } from "rosie";
import { NotFoundError, ValidationError } from "../../utils/errors/app-errors";
const CategoryFactory = new Factory<any>()
  .attr("_id", faker.number.int({ min: 1, max: 1000 }))
  .attr("name", faker.commerce.productName());

const mockCategory = (rest: any) => {
  return {
    name: faker.commerce.productName(),
    ...rest,
  };
};
const mockPaginator = (rest: any) => {
  return {
    limit: faker.number.int({ min: 10, max: 100 }),
    page: faker.number.int({ min: 10, max: 100 }),
    ...rest,
  };
};

describe("Category Service", () => {
  let repository: MockCategoryRepository;

  beforeEach(() => {
    repository = new MockCategoryRepository();
  });

  afterEach(() => {
    repository = {} as MockCategoryRepository;
  });

  describe("Create Category", () => {
    test("Should create category", async () => {
      const service = new CategoryService();
      service.categoryRepository = new MockCategoryRepository();
      const reqBody = mockCategory({});
      const result = await service.CreateCategory(reqBody);
      expect(result).toMatchObject(
        FormateData({
          data: { _id: expect.any(Number), name: expect.any(String) },
        })
      );
    });
  });

  describe("Get Categories", () => {
    test("Should get Categories", async () => {
      const service = new CategoryService();
      service.categoryRepository = new MockCategoryRepository();
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const categories = CategoryFactory.buildList(randomLimit);
      const expectedResult = {
        data: categories,
        currentPage: faker.number.int({ min: 10, max: 100 }),
        totalPages: faker.number.int({ min: 10, max: 100 }),
        totalDocuments: faker.number.int({ min: 10, max: 100 }),
      };
      jest
        .spyOn(service.categoryRepository, "GetCategories")
        .mockImplementationOnce(() => Promise.resolve(expectedResult));
      const data = mockPaginator({});
      const result = await service.GetCategories(data);

      expect(result).toMatchObject(FormateData(expectedResult));
    });
  });
  describe("Get Category by id", () => {
    test("Should get category", async () => {
      const service = new CategoryService();
      service.categoryRepository = new MockCategoryRepository();
      const id = faker.string.nanoid();
      const existingCategory = mockCategory({ _id: id });
      jest
        .spyOn(service, "GetCategoryByID")
        .mockImplementationOnce(() =>
          Promise.resolve(FormateData(existingCategory))
        );
      const result = await service.GetCategoryByID(id);
      expect(result).toMatchObject(FormateData(existingCategory));
    });
    test("Category with that Id does not exist", async () => {
      const service = new CategoryService();
      service.categoryRepository = new MockCategoryRepository();
      const id = faker.string.nanoid();

      // Mocking the repository method instead of the service method
      jest
        .spyOn(service.categoryRepository, "GetCategoryById")
        .mockImplementationOnce(() =>
          Promise.reject(new NotFoundError("Category not found"))
        );

      // Using .rejects.toThrow() to assert the error
      await expect(service.GetCategoryByID(id)).rejects.toThrow(
        "Category not found"
      );
    });
    test("Category with invalid Id", async () => {
      const service = new CategoryService();
      service.categoryRepository = new MockCategoryRepository();
      const id = faker.string.nanoid();

      // Mocking the repository method instead of the service method
      jest
        .spyOn(service.categoryRepository, "GetCategoryById")
        .mockImplementationOnce(() =>
          Promise.reject(new ValidationError("Not valid ID"))
        );

      // Using .rejects.toThrow() to assert the error
      await expect(service.GetCategoryByID(id)).rejects.toThrow("Not valid ID");
    });
  });
  describe("Update Category", () => {
    test("Should update Category", async () => {
      const service = new CategoryService();
      service.categoryRepository = new MockCategoryRepository();
      const id = faker.string.nanoid();
      const reqBody = mockCategory({});
      const expectedResult = { id, ...reqBody };
      jest
        .spyOn(service.categoryRepository, "UpdateCategory")
        .mockImplementationOnce(() => Promise.resolve(expectedResult));
      expect(await service.UpdateCategory(id, reqBody)).toMatchObject(
        FormateData({ data: expectedResult })
      );
    });

    test("Category with that Id does not exist", async () => {
      const service = new CategoryService();
      service.categoryRepository = new MockCategoryRepository();
      const id = faker.string.nanoid();
      const reqBody = mockCategory({});
      jest
        .spyOn(service.categoryRepository, "UpdateCategory")
        .mockImplementationOnce(() =>
          Promise.reject(new NotFoundError("Category not found"))
        );
      await expect(service.UpdateCategory(id, reqBody)).rejects.toThrow(
        "Category not found"
      );
    });
  });
});
