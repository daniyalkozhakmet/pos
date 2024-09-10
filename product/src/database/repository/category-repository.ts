import ProductModel from "../models/Product";
import CategoryModel from "../models/Category";
import ShopModel from "../models/Shop";
import { ICategory, Paginator } from "../../utils/interfaces";
import { ShopRepository } from "./shop-repository";
import mongoose from "mongoose";
import { NotFoundError, ValidationError } from "../../utils/errors/app-errors";

export class CatgoryRepository {
  shopRepositort: ShopRepository;
  constructor() {
    this.shopRepositort = new ShopRepository();
  }
  async CreateCategory({ name, category_id }: ICategory) {
    console.log({ name, category_id });

    const new_category = new CategoryModel({
      name,
      category_id,
    });
    const categoryResult = await new_category.save();
    console.log("Category created");

    return categoryResult;
  }
  async FindCategory(data) {
    const existingCategory = await CategoryModel.findOne({ ...data });

    return existingCategory;
  }
  async UpdateCategory({ name, category_id, shop_id }: ICategory) {
    const exsitingCategory = await this.FindCategory({ category_id });
    if (shop_id) {
      const existedShop = await this.shopRepositort.FindShop({ shop_id });
      if (!exsitingCategory.shops.includes(existedShop._id)) {
        exsitingCategory.shops.push(existedShop._id);
      }
      if (!existedShop.categories.includes(exsitingCategory._id)) {
        existedShop.categories.push(exsitingCategory._id);
        await existedShop.save();
      }
    }

    exsitingCategory.name = name;
    await exsitingCategory.save();

    return exsitingCategory;
  }
  async GetCategoryById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingCategory =
      await CategoryModel.findById(id).populate("products");
    if (!existingCategory) {
      throw new NotFoundError("Category with that ID doe not exist");
    }

    return existingCategory;
  }
  async GetCategoryOfShopById(id: string, shop: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingCategory = await CategoryModel.findOne({
      _id: id,
      shops: shop,
    }).populate("products");
    if (!existingCategory) {
      throw new NotFoundError("Category with that ID does not exist");
    }

    return existingCategory;
  }
  async GetCategories(shop_id: string, { limit, page }: Paginator) {
    // const existingCategories = await CategoryModel.find({ shop_id }).exec();
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
    const existingCategories = await ShopModel.find({ shop_id })
      .skip(skip)
      .limit(limit)
      .populate("categories");
    return {
      data: existingCategories,
      currentPage: page,
      totalPages,
      totalDocuments,
    };
  }
}
