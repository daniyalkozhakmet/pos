import { UserRepository } from "../database/repository/user-repository";
import { FormateData, GeneratePassword, GenerateSalt } from "../utils";
import {
  APIError,
  NotFoundError,
  STATUS_CODES,
  ValidationError,
} from "../utils/errors/app-errors";
import {
  Paginator,
  UserCreateInputs,
  UserRole,
  UserUpdateInputs,
} from "../utils/interfaces";

export class UserService {
  repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }
  async CreateUser(userInputs: UserCreateInputs) {
    const { email, password, first_name, last_name, shop, address, role } =
      userInputs;
    const existingUser = await this.repository.FindUser({ email });
    if (existingUser) {
      throw new ValidationError("User already exists");
    }
    const existingShop = await this.repository.shopRepository.GetShopById(shop);
    if (!existingShop) {
      throw new ValidationError("Shop does not exist");
    }
    // create salt
    let salt = await GenerateSalt();

    let userPassword = await GeneratePassword(password, salt);

    const existingCustomer = await this.repository.CreateUser({
      address,
      email,
      salt,
      password: userPassword,
      first_name,
      last_name,
      role: role == UserRole.ADMIN ? role : UserRole.USER,
      shop,
    });
    return FormateData(existingCustomer);
  }
  async GetUsers(data: Paginator) {
    const existingUsers = await this.repository.GetUsers(data);
    return FormateData(existingUsers);
  }
  async GetUserById(id: string) {
    const existingUser = await this.repository.FindUserById(id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    return FormateData(existingUser);
  }
  async UpdateUser(id: string, data: UserUpdateInputs) {
    // let salt = await GenerateSalt();

    // let userPassword = await GeneratePassword(data.password, salt);
    // data.password = userPassword;
    // data.salt = salt

    const updatedUser = await this.repository.UpdateUser(id, data);
    return FormateData(updatedUser);
  }
  async DeleteUser(id: string) {
    const existingUser = await this.repository.FindUserById(id);
    if (!existingUser) {
      throw new ValidationError("User not found");
    }

    const isDeletedUser = await this.repository.DeleteUser(id);
    return FormateData({ message: isDeletedUser });
  }
  async CreateUserPayload(user, event: string) {
    if (user) {
      const payload = {
        event: event,
        data: { user },
      };

      return payload;
    } else {
      return FormateData({ error: "No user available" });
    }
  }
  async UpdateUserPayload(user, event: string) {
    if (user) {
      const payload = {
        event: event,
        data: { user },
      };

      return payload;
    } else {
      return FormateData({ error: "No user available" });
    }
  }
  async DeleteUserPayload(user_id: string, event: string) {
    if (user_id) {
      const payload = {
        event: event,
        data: { user: user_id },
      };

      return payload;
    } else {
      return FormateData({ error: "No user available" });
    }
  }
  async SubscribeEvents(payload: any) {
    console.log("Triggering.... User Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;
    const { user } = data;
    switch (event) {
      case "UPDATE_USER":
        this.UpdateUser(user.user_id, user);
        break;
    }
    // switch (event) {
    //   case "ADD_TO_WISHLIST":
    //   case "REMOVE_FROM_WISHLIST":
    //     this.AddToWishlist(userId, product);
    //     break;
    //   case "ADD_TO_CART":
    //     this.ManageCart(userId, product, qty, false);
    //     break;
    //   case "REMOVE_FROM_CART":
    //     this.ManageCart(userId, product, qty, true);
    //     break;
    //   case "CREATE_ORDER":
    //     this.ManageOrder(userId, order);
    //     break;
    //   default:
    //     break;
    // }
  }
}
