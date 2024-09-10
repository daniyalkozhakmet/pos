import { MockShopRepository } from "../database/repository/mock/mock-shop-repository";
import { ICategory, Paginator } from "../utils/interfaces";

export interface ICategoryRepository {
  shopRepository: MockShopRepository;
  CreateCategory(data: ICategory): Promise<any>;
  GetCategories(data: Paginator): Promise<any>;
  GetCategoryById(id: string): Promise<any>;
  UpdateCategory(id: string, data: ICategory): Promise<any>;
}
