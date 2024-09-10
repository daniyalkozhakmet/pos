import { ShopRepository } from "../database/repository/shop-repository";
import { FormateData } from "../utils";
import { APIError, STATUS_CODES } from "../utils/errors/app-errors";
import { IShop, Paginator } from "../utils/interfaces";

export class ShopService {
  shopRepository: ShopRepository;
  constructor() {
    this.shopRepository = new ShopRepository();
  }
  async GetAllShops(data: Paginator) {
    const categories = await this.shopRepository.GetShops(data);
    return FormateData(categories);
  }
  async CreateShop({ name }: IShop) {
    const createShop = await this.shopRepository.CreateShop({
      name,
    });
    return FormateData({ data: createShop });
  }
  async UpdateShop(id: string, data: IShop) {
    const updateShop = await this.shopRepository.UpdateShop(id, data);
    return FormateData({ data: updateShop });
  }
  async CreateShopPayload(shop, event: string) {
    if (shop) {
      const payload = {
        event: event,
        data: { ...shop._doc, shop_id: shop._doc._id.toString() },
      };

      return payload;
    } else {
      return FormateData({ error: "No shop available" });
    }
  }
  // async SubscribeEvents(payload: any) {
  //   console.log("Triggering.... User Events");

  //   payload = JSON.parse(payload);

  //   const { event, data } = payload;
  //   const { user } = data;
  //   switch (event) {
  //     case "CREATE_SHOP":
  //       this.CreateShopPayload(user.user_id, user);
  //       break;
  //   }
  // }
}
