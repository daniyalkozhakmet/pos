import { ProductRepository } from "../database/repository/product-repository";
import { ShopRepository } from "../database/repository/shop-repository";
import { FormateData } from "../utils";
import {
  IShop,
  Paginator,
  ProductInputs,
} from "../utils/interfaces";

export class ProductService {
  productRepository: ProductRepository;
  shopRepository: ShopRepository;
  constructor() {
    this.productRepository = new ProductRepository();
    this.shopRepository = new ShopRepository();
  }
  async GetAllProducts(shop_id: string, data: Paginator) {
    const products = await this.productRepository.GetAllProducts(shop_id, data);
    return FormateData(products);
  }
  async CreateProduct({
    name,
    description,
    stock_level,
    barcode,
    unit_price,
    category,
    supplier,
    shop_id,
  }: ProductInputs) {
    const createProduct = await this.productRepository.CreateProduct({
      name,
      description,
      stock_level,
      barcode,
      unit_price,
      category,
      supplier,
      shop_id,
    });
    return FormateData({ data: createProduct });
  }
  async GetProductById(id: string, shop: string) {
    const existingProduct = await this.productRepository.GetProductById(
      id,
      shop
    );
    return FormateData({ data: existingProduct });
  }
  async UpdateProduct(id: string, shop: string, data: ProductInputs) {
    const updatedProduct = await this.productRepository.UpdateProduct(
      id,
      shop,
      data
    );
    return FormateData({ data: updatedProduct });
  }
  async DeleteProduct(id: string, shop: string) {
    await this.productRepository.DeleteProduct(id, shop);
    return FormateData({ message: "Deleted successfully" });
  }
  async CreateShop(data: IShop) {
    const createShop = await this.shopRepository.CreateShop(data);

    return FormateData({ data: createShop });
  }
  async CreateProductPayload(product, event: string) {
    if (product) {
      console.log(product);

      const payload = {
        event: event,
        data: {
          shop: product.shop,
          product_id: product._doc._id,
          name: product._doc.name,
          barcode: product._doc.barcode,
          description: product._doc.description,
          stock_level: product._doc.stock_level,
          unit_price: product._doc.unit_price,
        },
      };

      return payload;
    } else {
      return FormateData({ error: "No product available" });
    }
  }
  async UpdateProductPayload(product, event: string) {
    if (product) {
      console.log(product);

      const payload = {
        event: event,
        data: {
          shop: product.shop,
          product_id: product._doc._id,
          name: product._doc.name,
          barcode: product._doc.barcode,
          description: product._doc.description,
          stock_level: product._doc.stock_level,
          unit_price: product._doc.unit_price,
        },
      };

      return payload;
    } else {
      return FormateData({ error: "No product available" });
    }
  }
  async DeleteProductPayload(product, event: string) {
    if (product) {
      console.log(product);

      const payload = {
        event: event,
        data: {
          ...product,
        },
      };

      return payload;
    } else {
      return FormateData({ error: "No product available" });
    }
  }
  async PurchaseProduct(data: {
    shop: string;
    products: {
      product_id: string;
      qty: number;
    }[];
  }) {
    await this.productRepository.PurchaseProduct(data);
  }
  // async CreateCategory(data: ICategory) {

  //   const createShop = await this.shopRepository.CreateShop(data);
  //   console.log({ message: "SHOP is created" });

  //   return FormateData({ data: createShop });
  // }
  async SubscribeEvents(payload: any) {
    console.log("Triggering.... User Events");

    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { user } = data;
    switch (event) {
      case "CREATE_SHOP":
        this.CreateShop(data);
        break;
      case "PURCHASE_PRODUCT":
        this.PurchaseProduct(data);
        break;
    }
  }
}
