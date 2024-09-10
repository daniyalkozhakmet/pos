import mongoose from "mongoose";
import { NotFoundError, ValidationError } from "../../utils/errors/app-errors";
import { ISupllier, Paginator } from "../../utils/interfaces";
import SupplierModel from "../models/Supplier";
import { ProductRepository } from "./product-repository";
import { ShopRepository } from "./shop-repository";

export class SupplierRepository {
  shopRepository: ShopRepository;
  productRepository: ProductRepository;
  constructor() {
    this.shopRepository = new ShopRepository();
  }
  async CreateSupllier({ name, address, shop_id, phone }: ISupllier) {
    const existingShop = await this.shopRepository.FindShop({ shop_id });
    const newSupplier = await SupplierModel.create({
      name,
      address,
      phone,
      shop: existingShop,
    });
    return newSupplier;
  }
  async GetAllSuplliersOfShop(shop: string, { page, limit }: Paginator) {
    // Get the total count of documents in the collection
    const totalDocuments = await SupplierModel.countDocuments();

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
    const existingSuplliers = await SupplierModel.find({ shop })
      .skip(skip)
      .limit(limit);
      return {
        data: existingSuplliers,
        currentPage: page,
        totalPages,
        totalDocuments,
      };
  }
  async GetSupllierById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingSupllier = await SupplierModel.findById(id);
    if (!existingSupllier) {
      throw new NotFoundError("Supplier not found");
    }
    return existingSupllier;
  }
  async GetSupllierOfShopById(id: string, shop: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingSupllier = await SupplierModel.findOne({ _id: id, shop });
    if (!existingSupllier) {
      throw new NotFoundError("Supplier not found");
    }
    return existingSupllier;
  }
  async UpdateSupplier(
    id: string,
    { name, address, shop_id, phone, product }: ISupllier
  ) {
    const existingSupllier = await this.GetSupllierById(id);
    existingSupllier.name = name;
    existingSupllier.address = address;
    existingSupllier.phone = phone;
    if (product) {
      const existingProduct =
        await this.productRepository.GetProductById(product);
      existingSupllier.products.push(existingProduct._id);
    }
    await existingSupllier.save();
    return existingSupllier;
  }
}
