import { UserRepository } from "../database/repository/user-repository";
import * as jwt from "jsonwebtoken";
import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  GenerateSignatureRefresh,
  ValidatePassword,
} from "../utils";
import {
  APIError,
  STATUS_CODES,
  ValidationError,
} from "../utils/errors/app-errors";
import {
  IUser,
  UserCreateInputs,
  UserSignInInputs,
  UserUpdateInputs,
} from "../utils/interfaces";
import { APP_SECRET } from "../config";
const FAILED_ATTEMPTS = 10;
export class UserService {
  repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }
  async SignIn(userInputs: UserSignInInputs) {
    const { email, password } = userInputs;

    const existingCustomer = await this.repository.FindUser({ email });

    if (existingCustomer) {
      const validPassword = await ValidatePassword(
        password,
        existingCustomer.password,
        existingCustomer.salt
      );
      if (validPassword) {
        if (existingCustomer.lockout_time) {
          const lockout_time = new Date(existingCustomer.lockout_time); // Example date from your data

          // Generate current timestamp for comparison
          const currentTime = Date.now(); // Returns the current time in milliseconds

          // Convert code_expires to a timestamp in milliseconds for comparison
          const lockoutTimeTimestamp = lockout_time.getTime();

          if (currentTime < lockoutTimeTimestamp) {
            throw new APIError("Log in back with that credentials later!");
          } else {
            existingCustomer.lockout_time = null;
            await existingCustomer.save();
          }
        }
        if (!existingCustomer.is_verified) {
          existingCustomer.failed_attempts++;

          if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
            const lockout_time = Date.now() + 5 * 60 * 1000; // Blocking 15 minutes
            existingCustomer.lockout_time = lockout_time;
            existingCustomer.failed_attempts = 0;
          }
          await existingCustomer.save();
          return FormateData({
            message: `We sent verification code to ${email} `,
            email,
          });
        }
        const token = await GenerateSignature({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        const refresh_token = await GenerateSignatureRefresh({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        existingCustomer.is_verified = true;
        existingCustomer.code_expires = null;
        existingCustomer.verification_code = null;
        existingCustomer.failed_attempts = 0;

        await existingCustomer.save();
        return FormateData({ id: existingCustomer._id, token, refresh_token });
      }
    }

    throw new ValidationError("Invalid Credentials");
  }
  async GenerateVerificationCode(email: string) {
    const existingCustomer = await this.repository.FindUser({ email });
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
    const codeExpiration = Date.now() + 15 * 60 * 1000; // Code valid for 15 minutes
    existingCustomer.verification_code = verificationCode;
    existingCustomer.code_expires = codeExpiration;

    await existingCustomer.save();
    return { email, verification_code: verificationCode };
  }
  SendVerificationCodePayload(
    data: { email: string; verification_code: number },
    event: string
  ) {
    if (data) {
      const payload = {
        event: event,
        data,
      };

      return payload;
    } else {
      return FormateData({ error: "No email vericiation available" });
    }
  }
  async VerifyEmail(email: string, verification_code: number) {
    const existingCustomer = await this.repository.FindUser({ email });
    if (existingCustomer) {
      if (existingCustomer.lockout_time) {
        const lockout_time = new Date(existingCustomer.lockout_time); // Example date from your data

        // Generate current timestamp for comparison
        const currentTime = Date.now(); // Returns the current time in milliseconds

        // Convert code_expires to a timestamp in milliseconds for comparison
        const lockoutTimeTimestamp = lockout_time.getTime();

        if (currentTime < lockoutTimeTimestamp) {
          throw new APIError("Too many request try later");
        } else {
          existingCustomer.lockout_time = null;
          await existingCustomer.save();
        }
      }
      if (existingCustomer.verification_code == verification_code) {
        //check if not expired
        // Assume code_expires is stored in a Date object format
        const codeExpires = new Date(existingCustomer.code_expires); // Example date from your data

        // Generate current timestamp for comparison
        const currentTime = Date.now(); // Returns the current time in milliseconds

        // Convert code_expires to a timestamp in milliseconds for comparison
        const codeExpiresTimestamp = codeExpires.getTime();

        if (currentTime > codeExpiresTimestamp) {
          throw new APIError("The verification code expired, request it again");
        }

        existingCustomer.is_verified = true;
        existingCustomer.code_expires = null;
        existingCustomer.verification_code = null;
        existingCustomer.failed_attempts = 0;

        await existingCustomer.save();

        const token = await GenerateSignature({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        const refresh_token = await GenerateSignatureRefresh({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        return FormateData({ id: existingCustomer._id, token, refresh_token });
      } else {
        existingCustomer.failed_attempts++;
        if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
          const lockout_time = Date.now() + 5 * 60 * 1000; // Blocking 15 minutes
          existingCustomer.lockout_time = lockout_time;
          existingCustomer.failed_attempts = 0;
        }
        await existingCustomer.save();
      }

      throw new APIError("The verification code does not match");
    }
  }
  async ResetPassword(
    email: string,
    password: string,
    verification_code: number
  ) {
    const existingCustomer = await this.repository.FindUser({ email });
    if (existingCustomer) {
      if (existingCustomer.lockout_time) {
        const lockout_time = new Date(existingCustomer.lockout_time); // Example date from your data

        // Generate current timestamp for comparison
        const currentTime = Date.now(); // Returns the current time in milliseconds

        // Convert code_expires to a timestamp in milliseconds for comparison
        const lockoutTimeTimestamp = lockout_time.getTime();

        if (currentTime < lockoutTimeTimestamp) {
          throw new APIError("Too many request try later");
        } else {
          existingCustomer.lockout_time = null;
          await existingCustomer.save();
        }
      }
      if (existingCustomer.verification_code == verification_code) {
        //check if not expired
        // Assume code_expires is stored in a Date object format
        const codeExpires = new Date(existingCustomer.code_expires); // Example date from your data

        // Generate current timestamp for comparison
        const currentTime = Date.now(); // Returns the current time in milliseconds

        // Convert code_expires to a timestamp in milliseconds for comparison
        const codeExpiresTimestamp = codeExpires.getTime();

        if (currentTime > codeExpiresTimestamp) {
          throw new APIError("The verification code expired, request it again");
        }
        //setting password
        let salt = await GenerateSalt();

        let newPassword = await GeneratePassword(password, salt);
        existingCustomer.is_verified = true;
        existingCustomer.code_expires = null;
        existingCustomer.verification_code = null;
        existingCustomer.failed_attempts = 0;
        existingCustomer.password = newPassword;
        existingCustomer.salt = salt;

        await existingCustomer.save();

        const token = await GenerateSignature({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        const refresh_token = await GenerateSignatureRefresh({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        return FormateData({
          id: existingCustomer._id,
          token,
          refresh_token,
          existingCustomer,
        });
      } else {
        existingCustomer.failed_attempts++;
        if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
          const lockout_time = Date.now() + 5 * 60 * 1000; // Blocking 15 minutes
          existingCustomer.lockout_time = lockout_time;
          existingCustomer.failed_attempts = 0;
        }
        await existingCustomer.save();
      }

      throw new APIError("The verification code does not match");
    }
  }
  async ForgotPasssword(email: string) {
    const existingCustomer = await this.repository.FindUser({ email });
    if (existingCustomer) {
      if (existingCustomer.lockout_time) {
        const lockout_time = new Date(existingCustomer.lockout_time); // Example date from your data

        // Generate current timestamp for comparison
        const currentTime = Date.now(); // Returns the current time in milliseconds

        // Convert code_expires to a timestamp in milliseconds for comparison
        const lockoutTimeTimestamp = lockout_time.getTime();

        if (currentTime < lockoutTimeTimestamp) {
          throw new APIError("Too many request try later");
        } else {
          existingCustomer.lockout_time = null;
          await existingCustomer.save();
        }
      }

      existingCustomer.failed_attempts++;

      if (existingCustomer.failed_attempts > FAILED_ATTEMPTS) {
        const lockout_time = Date.now() + 5 * 60 * 1000; // Blocking 15 minutes
        existingCustomer.lockout_time = lockout_time;
        existingCustomer.failed_attempts = 0;
      }
      await existingCustomer.save();
      return FormateData({
        message: `We sent verification code to ${email} `,
        email,
      });
    }
  }
  async RefreshToken(refresh_token: string) {
    const decoded = jwt.verify(refresh_token, APP_SECRET) as any; // Synchronously verify the token

    const email = decoded.email;
    if (email) {
      const existingCustomer = await this.repository.FindUser({ email });
      if (existingCustomer) {
        const token = await GenerateSignature({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        const refresh_token = await GenerateSignatureRefresh({
          id: existingCustomer._id,
          email: existingCustomer.email,
          role: existingCustomer.role,
          first_name: existingCustomer.first_name,
          last_name: existingCustomer.last_name,
          shop: existingCustomer.shop ? existingCustomer.shop : "",
        });
        return FormateData({ token, refresh_token });
      }
    }
    throw new APIError("Not Authorized");
  }
  // async SignUp(userInputs: UserSignUpInputs) {
  //   const { email, password, first_name, last_name, shop } = userInputs;
  //   const existingUser = await this.repository.FindUser({ email });
  //   if (existingUser) {
  //     throw new APIError(
  //       "error",
  //       STATUS_CODES.BAD_REQUEST,
  //       "User already exists"
  //     );
  //   }
  //   // create salt
  //   let salt = await GenerateSalt();

  //   let userPassword = await GeneratePassword(password, salt);

  //   const existingCustomer = await this.repository.CreateUser({
  //     shop,
  //     email,
  //     salt,
  //     password: userPassword,
  //     first_name,
  //     last_name,
  //     role: UserRole.USER,
  //   });

  //   const token = await GenerateSignature({
  //     id: existingCustomer._id,
  //     email: existingCustomer.email,
  //     role: existingCustomer.role,
  //     first_name: existingCustomer.first_name,
  //     last_name: existingCustomer.last_name,
  //   });
  //   return FormateData({ id: existingCustomer._id, token });
  // }
  async GetProfile(id: string) {
    const existingUser = await this.repository.FindUserById(id);

    if (!existingUser) {
      throw new ValidationError("No user");
    }
    return { data: existingUser };
  }
  async CreateUser(data: UserCreateInputs) {
    const {
      shop,
      email,
      salt,
      password,
      first_name,
      last_name,
      role,
      _id,
      address,
    } = data;
    console.log({ data });

    await this.repository.CreateUser({
      user_id: _id,
      shop,
      address,
      email,
      salt,
      password,
      first_name,
      last_name,
      role,
    });
  }
  async UpdateUser(data: UserUpdateInputs) {
    const {
      shop,
      email,
      salt,
      password,
      first_name,
      last_name,
      role,
      _id,
      address,
    } = data;

    await this.repository.UpdateUser({
      user_id: _id,
      shop,
      address,
      email,
      salt,
      password,
      first_name,
      last_name,
      role,
    });
  }
  async DeleteUser(data: string) {
    console.log(data);
    const res = await this.repository.DeleteUser(data);
    console.log(res);
  }
  async UpdateUserProfile(id: string, data: IUser) {
    const updatedUser = await this.repository.UpdateUserProfile(id, data);
    return updatedUser;
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
  async SubscribeEvents(payload: any) {
    console.log("Triggering.... User Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;
    const { user } = data;
    switch (event) {
      case "CREATE_USER":
        this.CreateUser(user);
        break;
      case "UPDATE_USER":
        this.UpdateUser(user);
        break;
      case "DELETE_USER":
        this.DeleteUser(user);
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
