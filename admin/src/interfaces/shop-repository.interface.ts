import { IShop, Paginator } from "../utils/interfaces";

export interface IShopRepository {
  CreateShop(data: IShop): Promise<any>;
  GetShops(data: Paginator): Promise<any>;
  GetShopById(id: string): Promise<any>;
  UpdateShop(id: string, data: IShop): Promise<any>;
}
