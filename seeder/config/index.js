"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_URL_USER_SEED = exports.DB_URL_ADMIN_SEED = void 0;
require("dotenv/config");
exports.DB_URL_ADMIN_SEED = process.env.MONGODB_URI_ADMIN_SEED;
exports.DB_URL_USER_SEED = process.env.MONGODB_URI_USER_SEED;
