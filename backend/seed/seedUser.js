import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "../models/user.js";

dotenv.config({ path: ".env" });

const seedData = [
  // { username: "User", password: "tesdulu", roles: "production" },
  {
    fullname: "admin_user",
    password: "apaaja",
    npk: "8901",
    position: "admin",
    dept: "PPIC",
  },
  // {
  //   username: "admin_user",
  //   password: "apaaja",
  //   roles: "user",
  // },
  // {
  //   username: "production-1",
  //   password: "apaaja",
  //   roles: "production-staff",
  // },
  // {
  //   username: "production-2",
  //   password: "apaaja",
  //   roles: "production-staff",
  // },
  // {
  //   username: "production-2",
  //   password: "apaaja",
  //   roles: "production-admin",
  // },
];

const seed = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/customerMTM");

    const existing = await user.countDocuments();
    if (existing > 0) {
      await user.insertMany(seedData);
      console.log("berhasil");
    } else {
      await user.insertMany(seedData);
    }

    console.log(existing);
    mongoose.disconnect();
  } catch (err) {
    console.error("Gagal seeding:", err);
    process.exit(1);
  }
};

seed();
