// seeders/admin-seeder.js

import mongoose from "mongoose";
import UserModel from "../models/User";
import UserModelUser from "./model/UserUser";
import { UserRole } from "../../utils/interfaces";
import { GeneratePassword, GenerateSalt } from "../../utils";
import { DB_URL_ADMIN_SEED, DB_URL_USER_SEED } from "../../config";
async function seedUserAdmin() {
  // Connect to the database
  console.log("Connecting");

  await mongoose.connect(DB_URL_ADMIN_SEED, {});

  // Check if admin already exists
  const existingAdmin = await UserModel.findOne({ role: UserRole.SUPER });

  if (!existingAdmin) {
    // Create admin credentials
    const adminCredentials = {
      email: "admin",
      first_name: "Admin User",
      last_name: "Admin User",
      password: "admin",
      role: UserRole.SUPER,
      address: "Adress",
      // Add other fields as needed
    };

    // Hash the admin password
    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(
      adminCredentials.password,
      salt
    );
    adminCredentials.password = hashedPassword;

    // Create admin user
    const existingUser = await UserModel.create({
      ...adminCredentials,
      salt,
    });
    console.log({ existingAdmin: existingUser._doc });

    console.log("Admin user in ADMIN SERVICE created successfully");
    const existingUserAdmin = {
      user_id: existingUser._doc._id.toString(),
      password: existingUser._doc.password,
      first_name: existingUser._doc.first_name,
      last_name: existingUser._doc.last_name,
      address: existingUser._doc.address,
      role: existingUser._doc.role,
      salt: existingUser._doc.salt,
      email: existingUser._doc.email,
    };
    mongoose.disconnect();
    await seedUserUser(existingUserAdmin);
  } else {
    console.log("Admin user already exists");
  }

  // Close the database connection
  await mongoose.disconnect();
}
async function seedUserUser(adminCredentials: {
  user_id: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
  address: string;
  salt: string;
  email: string;
}) {
  await mongoose.connect(DB_URL_USER_SEED, {});
  console.log({ adminCredentials });

  // Create admin user
  await UserModelUser.create(adminCredentials);

  console.log("Admin user in USER SERVICE created successfully");

  // Close the database connection
  await mongoose.disconnect();
}
// Execute the admin seeder
seedUserAdmin()
  .then(() => {
    console.log("Admin seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding admin:", err);
    process.exit(1);
  });
