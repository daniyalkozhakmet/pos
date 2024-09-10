"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePurchase = void 0;
var Joi = require("joi");
var schema = Joi.object({
    payment_method: Joi.string().min(3).max(30).required().messages({
        "string.base": "Name should be a type of text.",
        "string.empty": "Name cannot be an empty field.",
        "string.min": "Name should have a minimum length of {#limit}.",
        "string.max": "Name should have a maximum length of {#limit}.",
        "any.required": "Name is a required field.",
    }),
});
var ValidatePurchase = function (req, res, next) {
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
exports.ValidatePurchase = ValidatePurchase;
