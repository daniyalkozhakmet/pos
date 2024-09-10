import { Express, NextFunction, Request, Response } from "express";
import * as amqplib from "amqplib";
import { EmailService } from "../services/email-service";
import { SubscribeMessage } from "../utils";
export default (app: Express, channel: amqplib.Channel) => {
  const service = new EmailService();
  SubscribeMessage(channel, service);
};
