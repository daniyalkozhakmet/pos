import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Last name should be a type of text.",
    "string.empty": "Last name cannot be an empty field.",
    "string.min": "Last name should have a minimum length of {#limit}.",
    "string.max": "Last name should have a maximum length of {#limit}.",
    "any.required": "Last name is a required field.",
  }),
  address: Joi.string().min(3).max(30).required().messages({
    "string.base": "Last name should be a type of text.",
    "string.empty": "Last name cannot be an empty field.",
    "string.min": "Last name should have a minimum length of {#limit}.",
    "string.max": "Last name should have a maximum length of {#limit}.",
    "any.required": "Last name is a required field.",
  }),
  phone: Joi.string().min(3).max(30).required().messages({
    "string.base": "Last name should be a type of text.",
    "string.empty": "Last name cannot be an empty field.",
    "string.min": "Last name should have a minimum length of {#limit}.",
    "string.max": "Last name should have a maximum length of {#limit}.",
    "any.required": "Last name is a required field.",
  }),
});

export const ValidateSupplier = (
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
