import mongoose from "mongoose";
import { IShop, Paginator } from "../../utils/interfaces";
import ShopModel from "../models/Shop";
import { NotFoundError, ValidationError } from "../../utils/errors/app-errors";
import { IShopRepository } from "../../interfaces/shop-repository.interface";
export class ShopRepository implements IShopRepository {
  async CreateShop({ name }: IShop) {
    const new_shop = new ShopModel({
      name,
    });

    const shopResult = await new_shop.save();
    return shopResult;
  }
  async GetShopById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingShop = await ShopModel.findById(id);
    if (!existingShop) {
      throw new NotFoundError("Shop not found");
    }
    return existingShop;
  }
  async GetShops({ page, limit }: Paginator) {
    // Get the total count of documents in the collection
    const totalDocuments = await ShopModel.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalDocuments / limit);
    let skip = (page - 1) * limit;
    if (totalPages < page) {
      page = totalPages;
      skip = (page - 1) * limit;
    }
    if (page < 0) {
      page = 1;
      skip = (page - 1) * limit;
    }
    const existingShops = await ShopModel.find()
      .skip(skip)
      .limit(limit)
      .populate("categories");
    return {
      data: existingShops,
      currentPage: page,
      totalPages,
      totalDocuments,
    };
  }
  async UpdateShop(id: string, data: IShop) {
    const existedShop = await this.GetShopById(id);
    existedShop.name = data.name;
    existedShop.save();
    return existedShop;
  }
}
