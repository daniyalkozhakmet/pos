import * as amqplib from "amqplib";
import { Express, NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product-service";
import UserAuth from "./middlewares/auth";
import { SubscribeMessage } from "../utils";
import { APIError } from "../utils/errors/app-errors";
export default (app: Express, channel: amqplib.Channel) => {
  const service = new ProductService();
  SubscribeMessage(channel, service);
  app.get(
    "/products",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const shop_id = req.user.shop;
        let page = Number(req.query.page);
        let limit = 10;
        if (!page) {
          page = 1;
        }
        const {
          data: { data },
        } = await service.GetAllProducts(shop_id, { limit, page });
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.get(
    "/products/:barcode",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const shop_id = req.user.shop;
        const barcode = req.params.barcode;
        const { data } = await service.GetProductByBarcodeAndShop({
          shop: shop_id,
          barcode,
        });

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("*", function (req: Request, res: Response) {
    throw new APIError("Route does not exists");
  });
};
