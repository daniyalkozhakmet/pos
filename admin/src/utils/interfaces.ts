export interface Paginator {
  limit: number;
  page: number;
}
export interface IShop {
  name: string;
}
export interface ICategory {
  name: string;
  shop?: string;
}
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  VIEWER = "viewer",
  SUPER = "super",
}
export interface UserCreateInputs {
  first_name: string;
  address: string;
  last_name: string;
  email: string;
  password: string;
  shop: string;
  salt?: string;
  role?: string;
}
export interface UserUpdateInputs {
  first_name: string;
  address: string;
  last_name: string;
  email: string;
  password?: string;
  role?: string;
  shop: string;
  salt?: string;
}

export interface IUser {
  first_name: string;
  last_name: string;
  address: string;
  salt: string;
  email: string;
  password: string;
  shop: string;
  is_verified?: boolean;
  verification_code?: number | null;
  code_expires?: Date | null;
  failed_attempts?: number;
  lockout_time?: Date | null;
  role: UserRole;
}
