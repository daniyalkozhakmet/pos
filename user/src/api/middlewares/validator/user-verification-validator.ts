import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

const schema = Joi.object({
  verification_code: Joi.number()
    .integer()
    .min(100000)
    .max(999999)
    .required()
    .messages({
      "number.base": "Verification code must be a number.",
      "number.min": "Verification code must be exactly 6 digits.",
      "number.max": "Verification code must be exactly 6 digits.",
      "any.required": "Verification code is required.",
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.email": "Please enter a valid email address.",
      "string.empty": "Email cannot be an empty field.",
    }),
});

export const ValidateUserVerification = (
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
