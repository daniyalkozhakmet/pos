"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var utils_1 = require("./utils");
var Schema = mongoose_1.default.Schema;
// delete mongoose.models.User;
var userSchema = new Schema({
    user_id: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    shop: {
        type: String,
        validate: {
            validator: function (value) {
                // Check if the role is not 'admin' and the shop field is empty
                if (this.role !== utils_1.UserRole.SUPER && !value) {
                    return false;
                }
                return true;
            },
            message: "Shop is required for non-super users.",
        },
        required: function () {
            // The 'shop' field is required if the role is not 'admin'
            return this.role !== utils_1.UserRole.SUPER;
        },
    },
    role: {
        type: String,
        enum: Object.values(utils_1.UserRole),
        default: utils_1.UserRole.USER,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.models.UserModel ||
    mongoose_1.default.model("UserModel", userSchema);
