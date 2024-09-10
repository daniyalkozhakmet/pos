import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name should be a type of text.",
    "string.empty": "Name cannot be an empty field.",
    "string.min": "Name should have a minimum length of {#limit}.",
    "string.max": "Name should have a maximum length of {#limit}.",
    "any.required": "Name is a required field.",
  }),
  barcode: Joi.required().messages({
    "string.alphanum": "Barcode must only contain alphanumeric characters.",
    "string.empty": "Barcode cannot be an empty field.",
    "any.required": "Barcode is a required field.",
  }),
  stock_level: Joi.required().messages({
    "string.alphanum": "Stock level must only contain alphanumeric characters.",
    "string.empty": "Stock level cannot be an empty field.",
    "any.required": "Stock level is a required field.",
  }),
  unit_price: Joi.required().messages({
    "string.alphanum": "Price must only contain alphanumeric characters.",
    "string.empty": "Price cannot be an empty field.",
    "any.required": "Price is a required field.",
  }),

  description: Joi.string().min(3).max(30).required().messages({
    "string.base": "Description should be a type of text.",
    "string.empty": "Description cannot be an empty field.",
    "string.min": "Description should have a minimum length of {#limit}.",
    "string.max": "Description should have a maximum length of {#limit}.",
    "any.required": "Description is a required field.",
  }),
  category: Joi.string().min(3).max(30).required().messages({
    "string.base": "Category should be a type of text.",
    "string.empty": "Category cannot be an empty field.",
    "string.min": "Category should have a minimum length of {#limit}.",
    "string.max": "Category should have a maximum length of {#limit}.",
    "any.required": "Category is a required field.",
  }),
  supplier: Joi.string().min(3).max(30).messages({
    "string.base": "Supplier should be a type of text.",
    "string.empty": "Supplier cannot be an empty field.",
    "string.min": "Supplier should have a minimum length of {#limit}.",
    "string.max": "Supplier should have a maximum length of {#limit}.",
    "any.required": "Supplier is a required field.",
  }),
});

export const ValidateProduct = (
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
