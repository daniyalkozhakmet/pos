import * as amqplib from "amqplib";
import { Express, NextFunction, Request, Response } from "express";
import UserAuth from "./middlewares/auth";
import { PurchaseService } from "../services/purchase-service";
import { ValidationError } from "../utils/errors/app-errors";
import { PublishMessage } from "../utils";
import { PRODUCT_SERVICE } from "../config";
import { ValidatePurchase } from "./middlewares/validator/purchase-validator";
export default (app: Express, channel: amqplib.Channel) => {
  const service = new PurchaseService();
  app.post(
    "/purchase/add/:barcode",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const shop_id = req.user.shop;
        const barcode = req.params.barcode;
        const qty = Number(req.query.qty) || 1;
        const { data } = await service.AddToCart(
          { shop: shop_id, barcode },
          qty
        );
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/purchase/remove/:barcode",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const shop_id = req.user.shop;
        const barcode = req.params.barcode;
        const { data } = await service.RemoveFromCart({
          shop: shop_id,
          barcode,
        });
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/purchase/complete",
    UserAuth,
    ValidatePurchase,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const shop_id = req.user.shop;
        const { payment_method } = req.body;

        if (!payment_method) {
          throw new ValidationError("Please fill in all fields");
        }
        const { data } = await service.CompletePurchase({
          shop: shop_id,
          payment_method,
        });
        res.json({ response: { data } });
        const payload = await service.CompletePurchasePayload(
          shop_id,
          data.items,
          "PURCHASE_PRODUCT"
        );
        PublishMessage(channel, PRODUCT_SERVICE, JSON.stringify(payload));
      } catch (error) {
        next(error);
      }
    }
  );
};
