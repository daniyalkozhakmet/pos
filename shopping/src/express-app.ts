import * as cors from "cors";
import * as express from "express";
import * as amqplib from "amqplib";
import * as cookieParser from "cookie-parser";
import product from "./api/product";
import purchase from "./api/purchase";
export default async (app: express.Express, channel: amqplib.Channel) => {
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());

  purchase(app, channel);
  
  product(app, channel);
  // error handling
};
