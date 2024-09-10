import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

const schema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).messages({
    "string.pattern.base":
      "Password must be between 3 to 30 characters and contain only alphanumeric characters.",
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

export const ValidateUser = (
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
