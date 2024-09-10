import { Request, Response, NextFunction } from "express";
import { ValidateSignatureCookie, ValidateSignatureRefresh } from "../../utils";
import axios from "axios";
import { APP_SECRET, USER_SERVICE_URL } from "../../config";
import * as jwt from "jsonwebtoken";
export default async (req: Request, res: Response, next: NextFunction) => {
  let isAuthorized = ValidateSignatureCookie(req);

  if (isAuthorized) {
    return next();
  }
  
  const refresh_token = ValidateSignatureRefresh(req);
  if (refresh_token) {
    const {
      data: { response },
    } = await axios.post(`${USER_SERVICE_URL}/refresh/${refresh_token}`);
    if (response.data) {
      const { token, refresh_token } = response.data;
      const decoded = jwt.verify(token, APP_SECRET) as any; // Synchronously verify the token
      req.user = decoded;
      res.cookie("token", token, {
        httpOnly: true, // Cookie cannot be accessed via client-side scripts
        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
        sameSite: "strict", // Helps to prevent CSRF attacks
        maxAge: 3600, // 1 hour in milliseconds
      });
      res.cookie("refresh-token", refresh_token, {
        httpOnly: true, // Cookie cannot be accessed via client-side scripts
        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
        sameSite: "strict", // Helps to prevent CSRF attacks
        maxAge: 3600000 * 24 * 30, // 1 month in milliseconds
      });
      return next();
    }
  }
  return res.status(403).json({ response: { error: "Not Authorized" } });
};
