import { Request } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as amqplib from "amqplib";
import {
  ADMIN_SERVICE,
  APP_SECRET,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
} from "../config";
import { UserService } from "../services/user-service";

export const ValidateSignatureCookie = (req: Request): boolean => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, APP_SECRET) as any; // Synchronously verify the token
      if (decoded.role == "super") {
        req.user = decoded;
        return true;
      }

      // Attach decoded payload to request object
      return false;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const ValidateSignatureJWT = (req: Request, token: string): boolean => {
  try {

    if (token) {
      const decoded = jwt.verify(token, APP_SECRET) as any; // Synchronously verify the token
      if (decoded.role == "super") {
        req.user = decoded;
        return true;
      }

      // Attach decoded payload to request object
      return false;
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
      const decoded = jwt.verify(token, APP_SECRET) as any; // Synchronously verify the token
      if (decoded.role == "super") {
        return token;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const FormateData = (data: null | any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
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

// export const GenerateSignature = async (payload: JWTSignuture) => {
//   try {
//     return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };
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
  service: UserService
) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);
  channel.bindQueue(q.queue, EXCHANGE_NAME, ADMIN_SERVICE);
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
