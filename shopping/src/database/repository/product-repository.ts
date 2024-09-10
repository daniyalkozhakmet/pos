import { NotFoundError } from "../../utils/errors/app-errors";
import { IProduct, IProductSearch, Paginator } from "../../utils/interfaces";
import ProductModel from "../models/Product";

export class ProductRepository {
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
  async GetProductByBarcodeAndShop(data: IProductSearch) {
    const existingProduct = await this.FindProduct(data);
    if (!existingProduct) {
      throw new NotFoundError("Product with that barcode does not exist");
    }
    return existingProduct;
  }
  async CreateProduct(data: IProduct) {
    const productCreate = new ProductModel({ ...data });
    await productCreate.save();
    console.log({ productCreate });
  }
  async FindProduct(data: IProductSearch) {
    const existingProduct = await ProductModel.findOne({ ...data });
    if (!existingProduct) {
      throw new NotFoundError("Product with that barcode does not exist");
    }
    return existingProduct;
  }
  async UpdateProduct(data: IProduct) {
    const {
      product_id,
      name,
      stock_level,
      unit_price,
      barcode,
      description,
      shop,
    } = data;
    const productUpdate = await this.FindProduct({ shop, product_id });
    productUpdate.name = name;
    productUpdate.stock_level = stock_level;
    productUpdate.unit_price = unit_price;
    productUpdate.barcode = barcode;
    productUpdate.description = description;
    await productUpdate.save();
  }
  async DeleteProduct(data: IProductSearch) {
    const existingProduct = await this.FindProduct(data);
    await existingProduct.deleteOne();
  }
}
