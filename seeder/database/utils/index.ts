import * as bcrypt from "bcryptjs";
export interface IUser {
  user_id: string;
  first_name: string;
  last_name: string;
  address: string;
  salt: string;
  email: string;
  password: string;
  shop: string;
  is_verified: boolean;
  verification_code: number | null;
  code_expires: Date | null;
  failed_attempts: number;
  lockout_time: Date | null;
  role: UserRole;
}
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  VIEWER = "viewer",
  SUPER = "super",
}
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
