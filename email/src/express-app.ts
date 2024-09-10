import * as cors from "cors";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as amqplib from "amqplib";
import email from "./api/email";
export default async (app: express.Express, channel: amqplib.Channel) => {
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());
  email(app, channel);

  // error handling
};
