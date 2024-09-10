import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  let role = req.user.role;

  if (role == "admin") {
    return next();
  }
  return res.status(403).json({ message: "Not Authorized" });
};
