import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWTSignuture } from "./interfaces";
import { Request } from "express";
import * as amqplib from "amqplib";
import {
  APP_SECRET,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  ADMIN_SERVICE,
  USER_SERVICE,
} from "../config";
import { UserService } from "../services/user-service";
//Utility functions

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload: JWTSignuture) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const GenerateSignatureRefresh = async (payload: JWTSignuture) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateSignatureCookie = (req: Request): boolean => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, APP_SECRET) as any; // Synchronously verify the token
      req.user = decoded;
      console.log("Here");

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

export const FormateData = (
  data: null | { token: string; id: string } | any
) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
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
  service: UserService
) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, EXCHANGE_NAME, USER_SERVICE);

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
