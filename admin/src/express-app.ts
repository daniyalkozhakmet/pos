import * as cors from "cors";
import * as express from "express";
import * as amqplib from "amqplib";
import * as cookieParser from "cookie-parser";
import shop from "./api/shop";
import user from "./api/user";
import category from "./api/category";
export default async (app: express.Express, channel: amqplib.Channel) => {
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());
  shop(app, channel);
  category(app, channel);
  user(app, channel);

  // error handling
};
