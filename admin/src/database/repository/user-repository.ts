import mongoose from "mongoose";
import {
  IUser,
  Paginator,
  UserRole,
  UserUpdateInputs,
} from "../../utils/interfaces";
import UserModel from "../models/User";
import { ShopRepository } from "./shop-repository";
import { ValidationError } from "../../utils/errors/app-errors";

export class UserRepository {
  shopRepository: ShopRepository;
  constructor() {
    this.shopRepository = new ShopRepository();
  }
  async CreateUser({
    first_name,
    last_name,
    email,
    address,
    password,
    role,
    salt,
    shop,
  }: IUser) {
    const existing_shop = await this.shopRepository.GetShopById(shop);

    const new_user = new UserModel({
      first_name,
      address,
      last_name,
      email,
      salt,
      password,
      role,
      shop: existing_shop,
    });
    const userResult = await new_user.save();

    return userResult;
  }
  async FindUser({ email }) {
    const existingUser = await UserModel.findOne({ email: email });
    return existingUser;
  }

  async FindUserById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new ValidationError("Not valid ID");
    }
    const existingUser = await UserModel.findById(id);

    return existingUser;
  }
  async FindUserByShop({ shop }) {
    const existingUsers = await UserModel.where({ shop });
    return existingUsers;
  }
  async UpdateUser(id: string, data: UserUpdateInputs) {
    const existingUser = await this.FindUserById(id);

    const existingShop = await this.shopRepository.GetShopById(data.shop);
    console.log({ data });

    if (data.role) {
      switch (data.role) {
        case UserRole.ADMIN:
          console.log("ADMIN");

          existingUser.role = UserRole.ADMIN;
          break;
        case UserRole.USER:
          existingUser.role = UserRole.USER;
          break;
      }
    }
    if (data.password && data.salt) {
      existingUser.password = data.password;
      existingUser.salt = data.salt;
    }
    existingUser.first_name = data.first_name;
    existingUser.last_name = data.last_name;
    existingUser.address = data.address;
    existingUser.email = data.email;
    existingUser.shop = existingShop._id;
    existingUser.save();
    return existingUser;
  }
  async GetUsers({ page, limit }: Paginator) {
    // Get the total count of documents in the collection
    const totalDocuments = await UserModel.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalDocuments / limit);
    let skip = (page - 1) * limit;
    if (totalPages < page) {
      page = totalPages;
      skip = (page - 1) * limit;
    }
    if (page < 0) {
      page = 1;
      skip = (page - 1) * limit;
    }
    const existingUsers = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .populate("shop");

    return {
      data: existingUsers,
      currentPage: page,
      totalPages,
      totalDocuments,
    };
  }
  async DeleteUser(id: string) {
    const existingUser = await this.FindUserById(id);
    await existingUser.deleteOne();
    return "User deleted successfully";
  }
}
