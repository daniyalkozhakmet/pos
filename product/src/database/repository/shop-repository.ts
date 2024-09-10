import { NotFoundError } from "../../utils/errors/app-errors";
import { IShop } from "../../utils/interfaces";
import ShopModel from "../models/Shop";

export class ShopRepository {
  async CreateShop(data: IShop) {
    const shopExist = new ShopModel(data);
    const shopResult = await shopExist.save();
    return shopResult;
  }
  async FindShop(data) {
    const shopExist = await ShopModel.findOne({ ...data });
    if (!shopExist) {
      throw new NotFoundError("Shop not found");
    }
    return shopExist;
  }
}
