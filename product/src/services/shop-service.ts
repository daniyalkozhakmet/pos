import { ShopRepository } from "../database/repository/shop-repository";
import { FormateData } from "../utils";
import { IShop } from "../utils/interfaces";

export class ShopService {
  shopRepository: ShopRepository;
  constructor() {
    this.shopRepository = new ShopRepository();
  }
  async CreateShop(data: IShop) {
    const createShop = await this.shopRepository.CreateShop(data);
    return FormateData({ data: createShop });
  }
}
