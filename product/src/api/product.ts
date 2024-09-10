import { Express, NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product-service";
import UserAuth from "./middlewares/auth";
import * as amqplib from "amqplib";
import { APIError, STATUS_CODES } from "../utils/errors/app-errors";
import { PublishMessage, SubscribeMessage } from "../utils";
import { SHOPPING_SERVICE } from "../config";
import { ValidateProduct } from "./middlewares/validator/product-validator";
export default (app: Express, channel: amqplib.Channel) => {
  const service = new ProductService();
  SubscribeMessage(channel, service);
  app.get(
    "",
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
        } = await service.GetAllProducts(shop_id, {
          limit,
          page,
        });
        console.log(data);

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.get(
    "/:id",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const product_id = req.params.id;
        const shop_id = req.user.shop;
        const {
          data: { data },
        } = await service.GetProductById(product_id, shop_id);

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "",
    UserAuth,
    ValidateProduct,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          name,
          barcode,
          description,
          stock_level,
          unit_price,
          category,
          supplier,
        } = req.body;
        const shop_id = req.user.shop;
        const {
          data: { data },
        } = await service.CreateProduct({
          name,
          barcode,
          description,
          stock_level,
          unit_price,
          category,
          supplier,
          shop_id,
        });

        const payload = await service.CreateProductPayload(
          { ...data, shop: shop_id },
          "CREATE_PRODUCT"
        );
        PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(payload));

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.put(
    "/:id",
    UserAuth,
    ValidateProduct,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const product_id = req.params.id;
        const shop_id = req.user.shop;
        const {
          name,
          barcode,
          description,
          stock_level,
          unit_price,
          category,
        } = req.body;
        const {
          data: { data },
        } = await service.UpdateProduct(product_id, shop_id, {
          name,
          barcode,
          description,
          stock_level,
          unit_price,
          category,
        });

        res.json({ response: { data } });
        const payload = await service.UpdateProductPayload(
          { ...data, shop: shop_id },
          "UPDATE_PRODUCT"
        );
        PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(payload));
      } catch (error) {
        next(error);
      }
    }
  );
  app.delete(
    "/:id",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const product_id = req.params.id;
        const shop_id = req.user.shop;
        const { data } = await service.DeleteProduct(product_id, shop_id);
        res.json({ response: { data } });
        const payload = await service.DeleteProductPayload(
          { product_id, shop: shop_id },
          "DELETE_PRODUCT"
        );
        PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(payload));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("*", function (req: Request, res: Response) {
    throw new APIError("Route does not exists");
  });
};
