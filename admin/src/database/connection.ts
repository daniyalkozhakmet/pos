import mongoose from "mongoose";
import { DB_URL } from "../config";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Db Connected");
  } catch (error) {
    console.error("Error ============ ON DB Connection");
    console.log(error);
  }
};

export default connectDB;
