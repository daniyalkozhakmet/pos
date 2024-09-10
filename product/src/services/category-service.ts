import { CatgoryRepository } from "../database/repository/category-repository";
import { ProductRepository } from "../database/repository/product-repository";
import { FormateData } from "../utils";
import { APIError, STATUS_CODES } from "../utils/errors/app-errors";
import { CategoryInputs, Paginator, ProductInputs } from "../utils/interfaces";

export class CategoryService {
  categoryRepository: CatgoryRepository;
  constructor() {
    this.categoryRepository = new CatgoryRepository();
  }
  async GetAllCategories(shop_id: string, data: Paginator) {
    const categories = await this.categoryRepository.GetCategories(
      shop_id,
      data
    );
    return FormateData(categories);
  }
  async CreateCategory({ name, category_id }: CategoryInputs) {
    if (!name) {
      throw new APIError("error");
    }
    const createCategory = await this.categoryRepository.CreateCategory({
      name,
      category_id,
    });
    console.log("Category Created");

    return FormateData({ data: createCategory });
  }
  async UpdateCategory({ name, category_id, shop_id }: CategoryInputs) {
    const updateCategory = await this.categoryRepository.UpdateCategory({
      name,
      category_id,
      shop_id,
    });

    return FormateData({ data: updateCategory });
  }
  async GetCategoryOfShopById(id: string, shop: string) {
    const existingCategory =
      await this.categoryRepository.GetCategoryOfShopById(id, shop);
    return FormateData({ data: existingCategory });
  }
  async SubscribeEvents(payload: any) {
    console.log("Triggering.... User Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;
    const { user } = data;
    switch (event) {
      case "CREATE_CATEGORY":
        this.CreateCategory(data);
        break;
      case "UPDATE_CATEGORY":
        this.UpdateCategory(data);
        break;
    }
  }
}
