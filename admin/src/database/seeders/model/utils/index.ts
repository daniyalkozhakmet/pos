
export interface IUser {
    user_id: string;
    first_name: string;
    last_name: string;
    salt: string;
    email: string;
    shop: string;
    address:string;
    password: string;
    role: UserRole;
  }
  export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    VIEWER = "viewer",
    SUPER = "super",
  }