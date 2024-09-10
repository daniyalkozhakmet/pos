"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateCategory = void 0;
var Joi = require("joi");
var schema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.base": "Name should be a type of text.",
        "string.alphanum": "Name must only contain alphanumeric characters.",
        "string.empty": "Name cannot be an empty field.",
        "string.min": "Name should have a minimum length of {#limit}.",
        "string.max": "Name should have a maximum length of {#limit}.",
        "any.required": "Name is a required field.",
    }),
    shop: Joi.string().min(3).max(30).messages({
        "string.base": "Shop should be a type of text.",
        "string.alphanum": "Shop must only contain alphanumeric characters.",
        "string.empty": "Shop cannot be an empty field.",
        "string.min": "Shop should have a minimum length of {#limit}.",
        "string.max": "Shop should have a maximum length of {#limit}.",
    }),
});
var ValidateCategory = function (req, res, next) {
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
exports.ValidateCategory = ValidateCategory;
