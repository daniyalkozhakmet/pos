import { CategoryRepository } from "../database/repository/category-repository";
import { FormateData } from "../utils";
import { ICategory, Paginator } from "../utils/interfaces";

export class CategoryService {
  categoryRepository: CategoryRepository;
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }
  async CreateCategory(data: ICategory) {
    const createCategory = await this.categoryRepository.CreateCategory(data);
    return FormateData({ data: createCategory });
  }
  async GetCategories(data: Paginator) {
    const existingCatgeories =
      await this.categoryRepository.GetCategories(data);
    return FormateData(existingCatgeories);
  }
  async GetCategoryByID(id: string) {
    const existingCatgeory = await this.categoryRepository.GetCategoryById(id);
    return FormateData({ data: existingCatgeory });
  }
  async UpdateCategory(id: string, data: ICategory) {
    const updatedCatgeory = await this.categoryRepository.UpdateCategory(
      id,
      data
    );
    return FormateData({ data: updatedCatgeory });
  }
  async CreateCategoryPayload(category, event: string) {
    if (category) {
      const payload = {
        event: event,
        data: {
          category_id: category._doc._id.toString(),
          name: category._doc.name,
        },
      };

      return payload;
    } else {
      return FormateData({ error: "No category available" });
    }
  }
  async UpdateCategoryPayload(category, shop_id: string, event: string) {
    if (category) {
      const payload = {
        event: event,
        data: {
          category_id: category._doc._id.toString(),
          shop_id,
          name: category._doc.name,
        },
      };

      return payload;
    } else {
      return FormateData({ error: "No category available" });
    }
  }
}
