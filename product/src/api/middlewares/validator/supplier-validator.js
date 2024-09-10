"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSupplier = void 0;
var Joi = require("joi");
var schema = Joi.object({
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
var ValidateSupplier = function (req, res, next) {
    var error = schema.validate(req.body, { abortEarly: false }).error;
    if (error) {
        var formattedErrors = error.details.map(function (err) { return ({
            message: err.message,
            path: err.path.join("."),
        }); });
        return res.status(400).json({ response: { error: formattedErrors } });
    }
    next();
};
exports.ValidateSupplier = ValidateSupplier;
