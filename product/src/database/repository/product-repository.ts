import ProductModel from "../models/Product";
import { IProduct, Paginator } from "../../utils/interfaces";
import { CatgoryRepository } from "./category-repository";
import mongoose from "mongoose";
import { NotFoundError, ValidationError } from "../../utils/errors/app-errors";
import { SupplierRepository } from "./supplier-repository";
import { ShopRepository } from "./shop-repository";
import CategoryModel from "../models/Category";
import SupplierModel from "../models/Supplier";
export class ProductRepository {
  categoryRepository: CatgoryRepository;
  supplierRepository: SupplierRepository;
  shopRepository: ShopRepository;
  constructor() {
    this.categoryRepository = new CatgoryRepository();
    this.supplierRepository = new SupplierRepository();
    this.shopRepository = new ShopRepository();
  }
  async CreateProduct({
    name,
    barcode,
    description,
    stock_level,
    unit_price,
    category,
    supplier,
    shop_id,
  }: IProduct) {
    const categoryExist =
      await this.categoryRepository.GetCategoryById(category);
    // const shopExist = await this.shopRepository.FindShop({ shop_id });
    const new_product = new ProductModel({
      name,
      barcode,
      description,
      stock_level,
      unit_price,
      category: categoryExist,
      shop: shop_id,
    });
    if (supplier) {
      const existingSupllier =
        await this.supplierRepository.GetSupllierOfShopById(supplier, shop_id);
      new_product.suppliers.push(existingSupllier._id);
    }
    const productResult = await new_product.save();
    console.log({ productResult });

    categoryExist.products.push(productResult._id);
    await categoryExist.save();
    return productResult;
  }
  async GetAllProducts(shop_id: string, { page, limit }: Paginator) {
    // Get the total count of documents in the collection
    const totalDocuments = await ProductModel.countDocuments();

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
    const products = await ProductModel.find({ shop: shop_id })
      .skip(skip)
      .limit(limit);
    return {
      data: products,
      currentPage: page,
      totalPages,
      totalDocuments,
    };
  }

  async GetProductById(id: string, shop: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingProduct = await ProductModel.findOne({ _id: id, shop })
      .populate("category")
      .populate("suppliers");
    if (!existingProduct) {
      throw new NotFoundError("Product does not exists with that ID");
    }
    return existingProduct;
  }
  async UpdateProduct(id: string, shop: string, data: IProduct) {
    const existingProduct = await this.GetProductById(id, shop);
    existingProduct.name = data.name;
    existingProduct.barcode = data.barcode;
    existingProduct.description = data.description;
    existingProduct.stock_level = data.stock_level;
    existingProduct.unit_price = data.unit_price;
    const { category, supplier } = data;
    if (category != existingProduct.category) {
      await this.UpdateCategoryOfProduct(
        existingProduct.category,
        category,
        existingProduct._id
      );
    }
    await existingProduct.save();
    return existingProduct;
  }
  async DeleteProduct(id: string, shop: string) {
    const existingProduct = await this.GetProductById(id, shop);
    await CategoryModel.findByIdAndUpdate(existingProduct.category, {
      $pull: { products: existingProduct._id },
    });
    await SupplierModel.findOneAndUpdate(
      { products: existingProduct._id },
      {
        $pull: { products: existingProduct._id },
      }
    );
    await existingProduct.deleteOne();
  }
  async UpdateCategoryOfProduct(
    from_id: string,
    to_id: string,
    product_id: string
  ) {
    await CategoryModel.findByIdAndUpdate(from_id, {
      $pull: { products: product_id },
    });

    // Add product to the new category's products list
    try {
      await CategoryModel.findByIdAndUpdate(to_id, {
        $addToSet: { products: product_id },
      });
    } catch (error) {
      throw new ValidationError("Category with that ID does not exist");
    }
  }
  async PurchaseProduct(data: {
    shop: string;
    products: {
      product_id: string;
      qty: number;
    }[];
  }) {
    const updates = data.products.map((item) => {
      return ProductModel.updateOne(
        { _id: item.product_id }, // Find by product ID
        [
          {
            $set: {
              stock_level: {
                $cond: [
                  { $lt: [{ $subtract: ["$stock_level", item.qty] }, 0] },
                  0,
                  { $subtract: ["$stock_level", item.qty] },
                ],
              },
            },
          },
        ]
      ).exec(); // Use exec() to return a promise
    });

    const results = await Promise.all(updates);
    console.log("Product has been purchased");
  }
}
