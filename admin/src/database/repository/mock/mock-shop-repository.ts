import { IShopRepository } from "../../../interfaces/shop-repository.interface";
import { ICategory, IShop, Paginator } from "../../../utils/interfaces";

export class MockShopRepository implements IShopRepository {
  CreateShop(data: IShop): Promise<any> {
    const mockShop = {
      _id: 123,
      ...data,
    };
    return Promise.resolve(mockShop);
  }
  GetShops(data: Paginator): Promise<any> {
    return Promise.resolve(data as unknown as any);
  }
  GetShopById(id: string): Promise<any> {
    return Promise.resolve(id as unknown as any);
  }
  UpdateShop(id: string, data: IShop): Promise<any> {
    return Promise.resolve(id as unknown as any);
  }
}
