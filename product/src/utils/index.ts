import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import * as amqplib from "amqplib";
import {
  ADMIN_SERVICE,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  PRODUCT_SERVICE,
} from "../config";
import { ProductService } from "../services/product-service";
import { CategoryService } from "../services/category-service";
//Utility functions

const APP_SECRET = process.env.APP_SECRET;

export const ValidateSignatureCookie = (req: Request): boolean => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, APP_SECRET) as any; // Synchronously verify the token
      req.user = decoded;

      // Attach decoded payload to request object
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const ValidateSignatureRefresh = (req: Request): string | null => {
  try {
    const token = req.cookies["refresh-token"];

    if (token) {
      jwt.verify(token, APP_SECRET) as any; // Synchronously verify the token

      return token;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data: null | any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
//Message Broker

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const PublishMessage = (
  channel: amqplib.Channel,
  service: string,
  msg: any
) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};
export const SubscribeMessage = async (
  channel: amqplib.Channel,
  service: ProductService | CategoryService
) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);
  channel.bindQueue(q.queue, EXCHANGE_NAME, PRODUCT_SERVICE);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
// export const SubscribeMessage = async (channel, service) => {
//   await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
//   const q = await channel.assertQueue("", { exclusive: true });
//   console.log(` Waiting for messages in queue: ${q.queue}`);

//   channel.bindQueue(q.queue, EXCHANGE_NAME, SHOPPING_SERVICE);

//   channel.consume(
//     q.queue,
//     (msg) => {
//       if (msg.content) {
//         console.log("the message is:", msg.content.toString());
//         service.SubscribeEvents(msg.content.toString());
//       }
//       console.log("[X] received");
//     },
//     {
//       noAck: true,
//     }
//   );
// };
