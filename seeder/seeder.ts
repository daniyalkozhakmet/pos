import mongoose from "mongoose";
import { createUserAdminModel } from "./database/models/UserAdmin";
import { createUserUserModel } from "./database/models/UserUser";
import { DB_URL_ADMIN_SEED, DB_URL_USER_SEED } from "./config";
import { GeneratePassword, GenerateSalt, UserRole } from "./database/utils";

async function seedUserAdmin() {
  // Connect to Admin DB
  const adminConnection = await mongoose.createConnection(
    DB_URL_ADMIN_SEED,
    {}
  );

  // Create the Admin model for the specific connection
  const UserAdmin = createUserAdminModel(adminConnection);

  // Check if admin already exists
  const existingAdmin = await UserAdmin.findOne({ role: UserRole.SUPER });

  if (!existingAdmin) {
    // Seed admin user...
    const adminCredentials = {
      email: "admin@gmail.com",
      first_name: "Admin User",
      last_name: "Admin User",
      password: "admin",
      role: UserRole.SUPER,
      address: "Adress",
      is_verified: true,
      verification_code: null,
      code_expires: null,
      // Other fields...
    };
    // Hash the admin password
    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(
      adminCredentials.password,
      salt
    );
    adminCredentials.password = hashedPassword;
    const newAdmin = new UserAdmin({ ...adminCredentials, salt });
    console.log({ newAdmin });
    await newAdmin.save();

    console.log("Admin user created in ADMIN SERVICE.");

    // Pass admin credentials to the user service seeder
    await seedUserUser({
      user_id: newAdmin._id.toString(),
      password: newAdmin.password,
      first_name: newAdmin.first_name,
      last_name: newAdmin.last_name,
      address: newAdmin.address,
      role: newAdmin.role,
      salt: newAdmin.salt,
      email: newAdmin.email,
      is_verified: newAdmin.is_verified,
      verification_code: newAdmin.verification_code,
      code_expires: newAdmin.code_expires,
      // Other fields...
    });
  } else {
    console.log("Admin user already exists.");
  }

  await adminConnection.close();
}

async function seedUserUser(adminCredentials) {
  // Connect to User DB
  const userConnection = await mongoose.createConnection(DB_URL_USER_SEED, {});

  // Create the User model for the specific connection
  const UserUser = createUserUserModel(userConnection);

  // Seed user service
  const newUser = await UserUser.create(adminCredentials);
  console.log("Admin user created in USER SERVICE.");

  await userConnection.close();
}

// Run the seeder
seedUserAdmin()
  .then(() => console.log("Seeding complete"))
  .catch((err) => console.error("Error during seeding:", err));
