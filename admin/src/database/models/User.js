"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var interfaces_1 = require("../../utils/interfaces");
var Schema = mongoose_1.default.Schema;
// delete mongoose.models.User;
var userSchema = new Schema({
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
    is_verified: {
        type: Boolean,
        default: false,
    },
    verification_code: {
        type: Number,
        default: null, // Default to null if no code is set
    },
    code_expires: {
        type: Date,
        default: null, // Default to null if no expiration is set
    },
    failed_attempts: {
        type: Number,
        default: 0, // Start at 0 failed attempts
    },
    lockout_time: {
        type: Date, // Stores the time when the user was locked out
        default: null,
    },
    shop: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ShopModel",
        validate: {
            validator: function (value) {
                // Check if the role is not 'admin' and the shop field is empty
                if (this.role !== interfaces_1.UserRole.SUPER && !value) {
                    return false;
                }
                return true;
            },
            message: "Shop is required for non-super users.",
        },
        required: function () {
            // The 'shop' field is required if the role is not 'admin'
            return this.role !== interfaces_1.UserRole.SUPER;
        },
    },
    role: {
        type: String,
        enum: Object.values(interfaces_1.UserRole),
        default: interfaces_1.UserRole.USER,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.models.UserModel ||
    mongoose_1.default.model("UserModel", userSchema);
