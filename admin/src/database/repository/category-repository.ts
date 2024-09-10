import mongoose from "mongoose";
import { ICategory, Paginator } from "../../utils/interfaces";
import Category from "../models/Category";
import { NotFoundError, ValidationError } from "../../utils/errors/app-errors";
import { ShopRepository } from "./shop-repository";
import { ICategoryRepository } from "../../interfaces/category-repository.interface";

export class CategoryRepository implements ICategoryRepository {
  shopRepository: ShopRepository;
  constructor() {
    this.shopRepository = new ShopRepository();
  }
  async CreateCategory({ name }: ICategory) {
    const newCategory = new Category({
      name,
    });

    const categoryResult = await newCategory.save();
    return categoryResult;
  }
  async GetCategories({ limit, page }: Paginator) {
    const totalDocuments = await Category.countDocuments();

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
    const exsitingCategories = await Category.find()
      .skip(skip)
      .limit(limit)
      .populate("shops");
    return {
      data: exsitingCategories,
      currentPage: page,
      totalPages,
      totalDocuments,
    };
  }
  async GetCategoryById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const exsitingCategory = await Category.findById(id);
    if (!exsitingCategory) {
      throw new NotFoundError("Category not found");
    }
    return exsitingCategory;
  }
  async UpdateCategory(id: string, { name, shop }: ICategory) {
    const exsitingCategory = await this.GetCategoryById(id);

    if (shop) {
      const existedShop = await this.shopRepository.GetShopById(shop);
      console.log(existedShop.categories);
      if (!exsitingCategory.shops.includes(existedShop._id)) {
        exsitingCategory.shops.push(existedShop._id);
      }
      if (!existedShop.categories.includes(exsitingCategory._id)) {
        existedShop.categories.push(exsitingCategory._id);
      }

      await existedShop.save();
    }
    exsitingCategory.name = name;

    await exsitingCategory.save();
    return exsitingCategory;
  }
}
