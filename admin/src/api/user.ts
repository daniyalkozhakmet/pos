import { Express, NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";
import UserAuth from "./middlewares/auth";
import * as amqplib from "amqplib";
import { APIError, STATUS_CODES } from "../utils/errors/app-errors";
import { PublishMessage, SubscribeMessage } from "../utils";
import { USER_SERVICE } from "../config";
import { ValidateUser } from "./middlewares/validator/user-validator";
export default (app: Express, channel: amqplib.Channel) => {
  const service = new UserService();
  SubscribeMessage(channel, service);
  app.post(
    "/users",
    UserAuth,
    ValidateUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, last_name, first_name, shop, address, role } =
          req.body;
        if (!email || !password || !first_name || !last_name || !address) {
          throw new APIError("Please fill in all the fields");
        }
        const data = await service.CreateUser({
          address,
          email,
          password,
          last_name,
          first_name,
          shop,
          role,
        });
        console.log({ data });

        const payload = await service.CreateUserPayload(
          data.data,
          "CREATE_USER"
        );

        PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));

        res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
  app.get(
    "/users/:id",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.params.id;
        const user = await service.GetUserById(userId);
        res.json({ response: user });
      } catch (error) {
        next(error);
      }
    }
  );
  app.get(
    "/users",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let page = Number(req.query.page);
        let limit = 10;
        if (!page) {
          page = 1;
        }
        const { data } = await service.GetUsers({ limit, page });
        res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/users/:id",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.params.id;
        const { email, last_name, first_name, shop, address, role } = req.body;
        if (!email || !first_name || !last_name || !address || !shop) {
          throw new APIError("Please fill in all the fields");
        }
        const { data } = await service.UpdateUser(userId, {
          email,
          last_name,
          first_name,
          shop,
          address,
          role,
        });
        const payload = await service.UpdateUserPayload(data, "UPDATE_USER");
        PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));
        return res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
  app.delete(
    "/users/:id",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user_id = req.params.id;
        const { data } = await service.DeleteUser(user_id);
        const payload = await service.DeleteUserPayload(user_id, "DELETE_USER");
        PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));
        return res.json({ response: data });
      } catch (error) {
        next(error);
      }
    }
  );
  app.get("*", function (req: Request, res: Response) {
    throw new APIError("Route does not exists");
  });
};
