import { ProductRepository } from "../database/repository/product-repository";
import { FormateData } from "../utils";
import { IProduct, IProductSearch, Paginator } from "../utils/interfaces";

export class ProductService {
  productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepository();
  }
  async GetAllProducts(shop_id: string, data: Paginator) {
    const products = await this.productRepository.GetAllProducts(shop_id, data);
    return FormateData(products);
  }
  async GetProductByBarcodeAndShop(data: IProductSearch) {
    const existingProduct =
      await this.productRepository.GetProductByBarcodeAndShop(data);
    return FormateData(existingProduct);
  }
  async CreateProduct(data: IProduct) {
    await this.productRepository.CreateProduct(data);
    console.log("Product saved");
  }
  async UpdateProduct(data: IProduct) {
    await this.productRepository.UpdateProduct(data);
    console.log("Product updated");
  }
  async DeleteProduct(data: IProductSearch) {
    await this.productRepository.DeleteProduct(data);
    console.log("Product deleted");
  }
  async SubscribeEvents(payload: any) {
    console.log("Triggering.... User Events");

    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "CREATE_PRODUCT":
        this.CreateProduct(data);
        break;
      case "UPDATE_PRODUCT":
        this.UpdateProduct(data);
        break;
      case "DELETE_PRODUCT":
        this.DeleteProduct(data);
        break;
    }
  }
}
