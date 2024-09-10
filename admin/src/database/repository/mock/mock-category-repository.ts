import { ICategoryRepository } from "../../../interfaces/category-repository.interface";
import { ICategory, Paginator } from "../../../utils/interfaces";
import { MockShopRepository } from "./mock-shop-repository";

export class MockCategoryRepository implements ICategoryRepository {
  shopRepository: MockShopRepository;
  CreateCategory(data: ICategory): Promise<any> {
    const mockCategory = {
      _id: 123,
      ...data,
    };
    return Promise.resolve(mockCategory);
  }
  GetCategories(data: Paginator): Promise<any> {
    return Promise.resolve([]);
  }
  GetCategoryById(id: string): Promise<any> {
    return Promise.resolve(id as unknown as any);
  }
  UpdateCategory(id: string, data: ICategory): Promise<any> {
    return Promise.resolve(id as unknown as any);
  }
}
