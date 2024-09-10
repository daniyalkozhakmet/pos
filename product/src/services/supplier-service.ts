import { SupplierRepository } from "../database/repository/supplier-repository";
import { FormateData } from "../utils";
import { ISupllier, Paginator } from "../utils/interfaces";

export class SupplierService {
  supllierRepository: SupplierRepository;
  constructor() {
    this.supllierRepository = new SupplierRepository();
  }
  async GetAllSuppliersOfShop(shop: string, data: Paginator) {
    const existingSuppliers =
      await this.supllierRepository.GetAllSuplliersOfShop(shop, data);
    return FormateData(existingSuppliers);
  }
  async CreateSupplier(data: ISupllier) {
    const createdSupplier = await this.supllierRepository.CreateSupllier(data);
    return FormateData({ data: createdSupplier });
  }
  async GetSupplierById(id: string) {
    const existingSupplier = await this.supllierRepository.GetSupllierById(id);
    return FormateData({ data: existingSupplier });
  }
  async UpdateSupplier(id: string, data: ISupllier) {
    const updatedSupplier = await this.supllierRepository.UpdateSupplier(
      id,
      data
    );
    return FormateData({ data: updatedSupplier });
  }
}
