import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

const schema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email cannot be an empty field.",
    }),
});

export const ValidateUserForgot = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const formattedErrors = error.details.map((err) => ({
      message: err.message,
      path: err.path.join("."),
    }));
    return res.status(400).json({ response: { error: formattedErrors } });
  }

  next();
};
