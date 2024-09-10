import { NotFoundError } from "../../utils/errors/app-errors";
import { IProductSearch, IPurchase } from "../../utils/interfaces";
import CartModel, { PaymentMethod } from "../models/Cart";
import ProductModel from "../models/Product";
import { ProductRepository } from "./product-repository";

export class PurchaseRepository {
  productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepository();
  }
  async AddtoCart(data: IProductSearch, quantity = 1) {
    const { shop } = data;
    const existingProduct = await this.productRepository.FindProduct(data);
    const activeCart = await this.GetActiveCart(shop);

    // Find the product in the cart
    const cartItem = activeCart.items.find(
      (item) => item.product.toString() === existingProduct._doc._id.toString()
    );

    if (cartItem) {
      // If the product is already in the cart, increase the quantity
      if (quantity == 1) {
        cartItem.qty += quantity;

        // activeCart.total_sum = existingProduct._doc.unit_price * cartItem.qty;
      } else {
        cartItem.qty = quantity;
      }

      cartItem.price = cartItem.qty * existingProduct._doc.unit_price;
      cartItem.product_id = existingProduct._doc.product_id;
    } else {
      // If the product is not in the cart, add it
      activeCart.items.push({
        product: existingProduct._id,
        product_id: existingProduct._doc.product_id,
        qty: quantity,
        price: existingProduct._doc.unit_price * quantity,
      });
      //   activeCart.total_sum = existingProduct._doc.unit_price * quantity;
    }
    let total_sum = 0;
    activeCart.items.forEach((item) => {
      total_sum += item.price;
    });
    activeCart.total_sum = total_sum;
    await activeCart.save();
    console.log("Product added to cart successfully");
    return activeCart;
  }
  async RemoveFromCart(data: IProductSearch) {
    const { shop } = data;
    const existingProduct = await this.productRepository.FindProduct(data);
    const activeCart = await this.GetActiveCart(shop);

    // Find the product in the cart
    // Find the index of the item to remove
    const itemIndex = activeCart.items.findIndex(
      (item) => item.product.toString() === existingProduct._doc._id.toString()
    );

    if (itemIndex > -1) {
      // Remove the item from the array
      activeCart.items.splice(itemIndex, 1);

      // Save the updated cart
      let total_sum = 0;
      activeCart.items.forEach((item) => {
        total_sum += item.price;
      });
      activeCart.total_sum = total_sum;
      await activeCart.save();
      console.log("Product removed from cart successfully");
    } else {
      console.log("Product not found in cart");
    }
    await activeCart.save();
    console.log("Product removed from cart successfully");
    return activeCart;
  }
  async CompletePurchase(data: IPurchase) {
    const { shop, payment_method } = data;
    const activeCart = await this.GetActiveCartLast(shop);
    activeCart.is_paid = true;
    switch (payment_method) {
      case PaymentMethod.CASH:
        activeCart.payment_method = PaymentMethod.CASH;
        break;
      case PaymentMethod.NONCASH:
        activeCart.payment_method = PaymentMethod.NONCASH;
        break;
      default:
        break;
    }
    await activeCart.save();
    const updates = activeCart.items.map((item) => {
      return ProductModel.updateOne(
        { _id: item.product }, // Find by product ID
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
      ).exec();
    });
    await Promise.all(updates);
    console.log("Purchase completed successfully");
    return activeCart;
  }
  async GetActiveCartLast(shop: string) {
    const activeCart = await CartModel.findOne({ shop, is_paid: false });
    if (!activeCart) {
      throw new NotFoundError("Cart not found");
    }
    return activeCart;
  }
  async GetActiveCart(shop: string) {
    const activeCart = await CartModel.findOne({ shop, is_paid: false });
    if (!activeCart) {
      const newActiveCart = await this.CreateCart(shop);
      return newActiveCart;
    }
    return activeCart;
  }
  async CreateCart(shop: string) {
    const createdCart = new CartModel({
      shop,
      items: [],
    });
    await createdCart.save();
    return createdCart;
  }
}
