import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await connectDB();

    const email = "teststudent@example.com";
    const newPassword = "Campus@123";

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      await mongoose.connection.close();
      process.exit(1);
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    console.log("");
    console.log("=================================");
    console.log("Password reset successfully!");
    console.log("=================================");
    console.log(`Email: ${email}`);
    console.log(`New password: ${newPassword}`);
    console.log("");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Password reset failed:");
    console.error(error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

resetPassword();