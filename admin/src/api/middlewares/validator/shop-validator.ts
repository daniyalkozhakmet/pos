import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name should be a type of text.",
    "string.alphanum": "Name must only contain alphanumeric characters.",
    "string.empty": "Name cannot be an empty field.",
    "string.min": "Name should have a minimum length of {#limit}.",
    "string.max": "Name should have a maximum length of {#limit}.",
    "any.required": "Name is a required field.",
  }),
});

export const ValidateShop = (
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
