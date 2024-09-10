import { Express, Request, Response, NextFunction } from "express";
import { UserService } from "../services/user-service";
import UserAuth from "./middlewares/auth";
import { APIError, ValidationError } from "../utils/errors/app-errors";
import * as amqplib from "amqplib";
import { PublishMessage, SubscribeMessage } from "../utils";
import { ADMIN_SERVICE, APP_SECRET, EMAIL_SERVICE } from "../config";
import { ValidateUser } from "./middlewares/validator/user-validator";
import { ValidateUserUpdate } from "./middlewares/validator/user-update-validator";
import { ValidateUserVerification } from "./middlewares/validator/user-verification-validator";
import { ValidateUserForgot } from "./middlewares/validator/user-forgot-validator";
import { ValidatePasswordVerification } from "./middlewares/validator/user-password-verification";

export default (app: Express, channel: amqplib.Channel) => {
  const service = new UserService();
  SubscribeMessage(channel, service);
  app.post(
    "/login",
    ValidateUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const { data } = await service.SignIn({ email, password });
        if (data.token) {
          res.cookie("token", data.token, {
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
            sameSite: "strict", // Helps to prevent CSRF attacks
            maxAge: 3600, // 1 hour in milliseconds
          });
          res.cookie("refresh-token", data.refresh_token, {
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
            sameSite: "strict", // Helps to prevent CSRF attacks
            maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
          });
        } else {
          const data_verify = await service.GenerateVerificationCode(email);

          const payload = service.SendVerificationCodePayload(
            data_verify,
            "VERIFY_EMAIL"
          );

          PublishMessage(channel, EMAIL_SERVICE, JSON.stringify(payload));
        }

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  //password/forgot
  app.post(
    "/password/forgot",
    ValidateUserForgot,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        if (!email) {
          throw new APIError("Fill in all fields");
        }
        const { data } = await service.ForgotPasssword(email);
        const data_verify = await service.GenerateVerificationCode(email);

        const payload = service.SendVerificationCodePayload(
          data_verify,
          "FORGOT_PASSWORD"
        );

        PublishMessage(channel, EMAIL_SERVICE, JSON.stringify(payload));
        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  ///password/verify
  app.post(
    "/password/verify",
    ValidatePasswordVerification,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, verification_code, password } = req.body;
        const { data } = await service.ResetPassword(
          email,
          password,
          verification_code
        );
        if (data.token) {
          res.cookie("token", data.token, {
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
            sameSite: "strict", // Helps to prevent CSRF attacks
            maxAge: 3600, // 1 hour in milliseconds
          });
          res.cookie("refresh-token", data.refresh_token, {
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
            sameSite: "strict", // Helps to prevent CSRF attacks
            maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
          });
          //Sending event to admin service
          const payload = await service.UpdateUserPayload(
            data.existingCustomer,
            "UPDATE_USER"
          );
          PublishMessage(channel, ADMIN_SERVICE, JSON.stringify(payload));
        }

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/email/verify",
    ValidateUserVerification,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, verification_code } = req.body;
        const { data } = await service.VerifyEmail(email, verification_code);
        if (data.token) {
          res.cookie("token", data.token, {
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
            sameSite: "strict", // Helps to prevent CSRF attacks
            maxAge: 3600, // 1 hour in milliseconds
          });
          res.cookie("refresh-token", data.refresh_token, {
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
            sameSite: "strict", // Helps to prevent CSRF attacks
            maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
          });
        }

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/refresh/:refresh",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const refresh_token = req.params.refresh;
        if (refresh_token) {
          const { data } = await service.RefreshToken(refresh_token);
          res.json({ response: { data } });
        }
      } catch (error) {
        next(error);
      }
    }
  );
  app.get(
    "/profile",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user;

        const { data } = await service.GetProfile(id);
        console.log({ data });

        res.json({ response: { data } });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/logout",
    UserAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("refresh-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.json({ response: { data: { message: "Logged out successfully" } } });
      // Optionally, you can send a response indicating the user is logged out
    }
  );
  app.put(
    "",
    UserAuth,
    ValidateUserUpdate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user_id = req.user.id;
        const { first_name, last_name, address, email } = req.body;
        const data = await service.UpdateUserProfile(user_id, {
          first_name,
          last_name,
          address,
          email,
        });
        res.json({ response: { data } });
        const payload = await service.UpdateUserPayload(data, "UPDATE_USER");
        PublishMessage(channel, ADMIN_SERVICE, JSON.stringify(payload));
      } catch (error) {
        next(error);
      }
    }
  );
  app.get("*", function (req: Request, res: Response) {
    throw new APIError("Route does not exists");
  });
};
// app.post(
//   "/signup",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, password, last_name, first_name,shop } = req.body;
//       if (!email || !password || !first_name || !last_name) {
//         throw new APIError(
//           "error",
//           STATUS_CODES.BAD_REQUEST,
//           "Pleas fill in all the fields"
//         );
//       }
//       const { data } = await service.SignUp({
//         shop,
//         email,
//         password,
//         last_name,
//         first_name,
//       });
//       res.cookie("token", data.token, {
//         httpOnly: true, // Cookie cannot be accessed via client-side scripts
//         secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
//         sameSite: "strict", // Helps to prevent CSRF attacks
//         maxAge: 3600000, // 1 hour in milliseconds
//       });

//       res.json(data);
//     } catch (error) {
//       next(error);
//     }
//   }
// );
