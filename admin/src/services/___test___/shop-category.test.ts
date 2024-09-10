import {
  expect,
  describe,
  jest,
  beforeEach,
  afterEach,
  test,
} from "@jest/globals";
import { faker } from "@faker-js/faker";
import { FormateData } from "../../utils";
import { Factory } from "rosie";
import { MockShopRepository } from "../../database/repository/mock/mock-shop-repository";
import { ShopService } from "../shop-service";
const ShopFactory = new Factory<any>()
  .attr("_id", faker.number.int({ min: 1, max: 1000 }))
  .attr("name", faker.commerce.productName());

const mockShop = (rest: any) => {
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
describe("Shop service", () => {
  let repository: MockShopRepository;
  beforeEach(() => {
    repository = new MockShopRepository();
  });

  afterEach(() => {
    repository = {} as MockShopRepository;
  });
  describe("Create Shop", () => {
    test("Should create Shop", async () => {
      const service = new ShopService();
      service.shopRepository = new MockShopRepository();
      const reqBody = mockShop({});
      const result = await service.CreateShop(reqBody);
      expect(result).toMatchObject(
        FormateData({
          data: { _id: expect.any(Number), name: expect.any(String) },
        })
      );
    });
  });

  describe("Get Shops", () => {
    test("Should get all shops", async () => {
      const service = new ShopService();
      service.shopRepository = new MockShopRepository();
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const shops = ShopFactory.buildList(randomLimit);
      const expectedResult = {
        data: shops,
        currentPage: faker.number.int({ min: 10, max: 100 }),
        totalPages: faker.number.int({ min: 10, max: 100 }),
        totalDocuments: faker.number.int({ min: 10, max: 100 }),
      };
      jest
        .spyOn(service.shopRepository, "GetShops")
        .mockImplementationOnce(() => Promise.resolve(expectedResult));
      const data = mockPaginator({});
      const result = await service.GetAllShops(data);

      expect(result).toMatchObject(FormateData(expectedResult));
    });
  });
});
