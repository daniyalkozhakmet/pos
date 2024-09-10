import { Express, NextFunction, Request, Response } from "express";
import * as amqplib from "amqplib";
import UserAuth from "./middlewares/auth";
import AdminAuth from "./middlewares/admin-auth";
import { SupplierService } from "../services/supplier-service";
import { APIError } from "../utils/errors/app-errors";
import { ValidateSupplier } from "./middlewares/validator/supplier-validator";
export default (app: Express, channel: amqplib.Channel) => {
  const service = new SupplierService();

  app.get(
    "/suppliers",
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
        } = await service.GetAllSuppliersOfShop(shop_id, {
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
    "/suppliers/:id",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = "await service.GetAllSuppliers()";
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/suppliers",
    UserAuth,
    AdminAuth,
    ValidateSupplier,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, address, phone } = req.body;
        if (!name || !address || !phone) {
          throw new APIError("Please fill in all fields");
        }
        const shop_id = req.user.shop;

        const {
          data: { data },
        } = await service.CreateSupplier({
          name,
          address,
          phone,
          shop_id,
        });
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
};
