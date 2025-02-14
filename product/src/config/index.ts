import "dotenv/config";
export const DB_URL = process.env.MONGODB_URI;
export const APP_SECRET = process.env.APP_SECRET;
export const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME;
export const SHOPPING_SERVICE = "SHOPPING_SERVICE";
export const PRODUCT_SERVICE = "PRODUCT_SERVICE";
export const ADMIN_SERVICE = "ADMIN_SERVICE";
export const USER_SERVICE = "USER_SERVICE";
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL;