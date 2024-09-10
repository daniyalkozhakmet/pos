import { Express, NextFunction, Request, Response } from "express";
import { ShopService } from "../services/shop-service";
import UserAuth from "./middlewares/auth";
import * as amqplib from "amqplib";
import { APIError } from "../utils/errors/app-errors";
import { PublishMessage } from "../utils";
import { PRODUCT_SERVICE } from "../config";
import { ValidateShop } from "./middlewares/validator/shop-validator";

export default (app: Express, channel: amqplib.Channel) => {
  const shop_service = new ShopService();
  app.get(
    "/shops",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let page = Number(req.query.page);
        let limit = 10;
        if (!page) {
          page = 1;
        }
        const { data } = await shop_service.GetAllShops({ limit, page });
        console.log({ data });

        res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/shops",
    UserAuth,
    ValidateShop,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name } = req.body;
        if (!name) {
          throw new APIError("Please fill in all the fields");
        }
        const { data } = await shop_service.CreateShop({ name });
        res.json({ response: data });
        const payload = await shop_service.CreateShopPayload(
          data.data,
          "CREATE_SHOP"
        );
        PublishMessage(channel, PRODUCT_SERVICE, JSON.stringify(payload));
      } catch (error) {
        next(error);
      }
    }
  );
  app.put(
    "/shops/:id",
    UserAuth,
    ValidateShop,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name } = req.body;
        const shopId = req.params.id;
        if (!name) {
          throw new APIError("Please fill in all the fields");
        }
        const { data } = await shop_service.UpdateShop(shopId, { name });
        res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
  // app.delete(
  //   "/delete/:id",
  //   UserAuth,
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const shopId = req.params.id;
  //       const { data } = await shop_service.UpdateShop(shopId, { name });
  //       res.json({ response: data });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );
};
