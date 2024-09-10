export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  VIEWER = "viewer",
  SUPER = "super",
}
export interface UserSignInInputs {
  email: string;
  password: string;
}
export interface UserSignUpInputs {
  first_name: string;
  last_name: string;
  email: string;
  shop: string;
  password: string;
}
export interface JWTSignuture {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  shop: UserRole;
}

export interface IUser {
  id?: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  salt?: string;
  email: string;
  shop?: string;
  address: string;
  password?: string;
  role?: UserRole;
  is_verified?: boolean;
  verification_code?: number | null;
  code_expires?: Date | null;
}
export interface UserCreateInputs {
  _id: string;
  first_name: string;
  last_name: string;
  salt: string;
  email: string;
  shop: string;
  address: string;
  password: string;
  role: UserRole;
}
export interface UserUpdateInputs {
  _id: string;
  first_name: string;
  last_name: string;
  salt: string;
  email: string;
  shop: string;
  address: string;
  password: string;
  role: UserRole;
}
