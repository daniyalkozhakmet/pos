import { PurchaseRepository } from "../database/repository/purchase-repository";
import { FormateData } from "../utils";
import {
  IProductSearch,
  IPurchase,
  IPurchaseCompletedPayload,
} from "../utils/interfaces";

export class PurchaseService {
  purchaseRepository: PurchaseRepository;
  constructor() {
    this.purchaseRepository = new PurchaseRepository();
  }
  async AddToCart(data: IProductSearch, quantity = 1) {
    const activeCart = await this.purchaseRepository.AddtoCart(data, quantity);
    return FormateData(activeCart);
  }
  async RemoveFromCart(data: IProductSearch) {
    const activeCart = await this.purchaseRepository.RemoveFromCart(data);
    return FormateData(activeCart);
  }
  async CompletePurchase(data: IPurchase) {
    const completedCart = await this.purchaseRepository.CompletePurchase(data);
    return FormateData(completedCart);
  }
  async CompletePurchasePayload(
    shop: string,
    data: IPurchaseCompletedPayload[],
    event: string
  ) {
    if (data.length > 0) {
      console.log({ data });
      const payload = {
        event,
        data: {
          shop,
          products: data.map((item) => ({
            product_id: item.product_id,
            qty: item.qty,
          })),
        },
      };

      return payload;
    } else {
      return FormateData({ error: "No purchase available" });
    }
  }
}
