import mongoose from "mongoose";
import { IUser, UserRole } from "../../utils/interfaces";
import UserModel from "../models/User";
import { ValidationError } from "../../utils/errors/app-errors";

export class UserRepository {
  async CreateUser({
    user_id,
    shop,
    address,
    first_name,
    last_name,
    email,
    password,
    role,
    salt,
  }: IUser) {
    const new_user = new UserModel({
      shop,
      user_id,
      address,
      first_name,
      last_name,
      email,
      salt,
      password,
      role,
    });
    const userResult = await new_user.save();
    return userResult;
  }
  async UpdateUser({
    user_id,
    shop,
    address,
    first_name,
    last_name,
    email,
    role,
  }: IUser) {
    const existingUser = await UserModel.findOne({ user_id });
    console.log({ existingUser });
    switch (role) {
      case UserRole.ADMIN:
        existingUser.role = role;
        break;
      case UserRole.USER:
        existingUser.role = role;
        break;

      default:
        break;
    }
    existingUser.shop = shop;
    existingUser.address = address;
    existingUser.first_name = first_name;
    existingUser.last_name = last_name;
    existingUser.email = email;
    existingUser.save();
    console.log({ existingUserSAved: existingUser });
    return existingUser;
  }
  async FindUser({ email }) {
    const existingUser = await UserModel.findOne({ email: email });
    return existingUser;
  }
  async DeleteUser(id: string) {
    const existingUser = await UserModel.findOne({ user_id: id });
    console.log({ existingUser });

    await existingUser.deleteOne();
    return "Deleted successfully";
  }
  async FindUserById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingUser = await UserModel.findById(id);
    return existingUser;
  }
  async UpdateUserProfile(
    id: string,
    { address, first_name, last_name, email }: IUser
  ) {
    const existingUser = await this.FindUserById(id);
    // existingUser.email = email;
    existingUser.address = address;
    existingUser.first_name = first_name;
    existingUser.last_name = last_name;
    await existingUser.save();
    return existingUser;
  }
}
