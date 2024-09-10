import { Express, NextFunction, Request, Response } from "express";
import * as amqplib from "amqplib";
import UserAuth from "./middlewares/auth";
import { CategoryService } from "../services/category-service";
import { APIError } from "../utils/errors/app-errors";
import { PublishMessage } from "../utils";
import { PRODUCT_SERVICE } from "../config";
import { ValidateCategory } from "./middlewares/validator/category-validator";
export default (app: Express, channel: amqplib.Channel) => {
  const categoryService = new CategoryService();
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
        const { data } = await categoryService.GetCategories({ limit, page });
        console.log({ data });

        res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/categories",
    UserAuth,
    ValidateCategory,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name } = req.body;
        if (!name) {
          throw new APIError("Please fill in all the fields");
        }
        const { data } = await categoryService.CreateCategory({ name });
        res.json({ response: data });
        const payload = await categoryService.CreateCategoryPayload(
          data.data,
          "CREATE_CATEGORY"
        );
        PublishMessage(channel, PRODUCT_SERVICE, JSON.stringify(payload));
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
        const categoryId = req.params.id;
        const { data } = await categoryService.GetCategoryByID(categoryId);
        res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
  app.put(
    "/categories/:id",
    UserAuth,
    ValidateCategory,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const categoryId = req.params.id;
        const { name, shop } = req.body;
        if (!name) {
          throw new APIError("Please fill in all the fields");
        }
        const { data } = await categoryService.UpdateCategory(categoryId, {
          name,
          shop,
        });
        const payload = await categoryService.UpdateCategoryPayload(
          data.data,
          shop,
          "UPDATE_CATEGORY"
        );
        PublishMessage(channel, PRODUCT_SERVICE, JSON.stringify(payload));
        res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
};
