import { Express, NextFunction, Request, Response } from "express";
import UserAuth from "./middlewares/auth";
import * as amqplib from "amqplib";
import { CategoryService } from "../services/category-service";
import { SubscribeMessage } from "../utils";

export default (app: Express, channel: amqplib.Channel) => {
  const service = new CategoryService();
  SubscribeMessage(channel, service);
  app.get(
    "/categories",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let page = Number(req.query.page);
        let limit = 10;
        if (!page) {
          page = 1;
        }
        const shop_id = req.user.shop;
        const {
          data: { data },
        } = await service.GetAllCategories(shop_id, {
          limit,
          page,
        });
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.get(
    "/categories/:id",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const category_id = req.params.id;
        const shop_id = req.user.shop;
        const {
          data: { data },
        } = await service.GetCategoryOfShopById(category_id, shop_id);
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  // app.post(
  //   "/products/categories",
  //   UserAuth,
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { name } = req.body;
  //       const { data } = await service.CreateCategory({
  //         name,
  //       });
  //       console.log(data);

  //       res.json(data);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );
};
