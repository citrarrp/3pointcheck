import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "../models/user.js";

dotenv.config({ path: ".env" });

const seedData = [
  // { fullname: "User", password: "tesdulu", roles: "production" },
  {
    fullname: "admin_user",
    password: "apaaja",
    roles: "admin",
  },
  // {
  //   fullname: "admin_user",
  //   password: "apaaja",
  //   roles: "user",
  // },
  // {
  //   fullname: "production-1",
  //   password: "apaaja",
  //   roles: "production-staff",
  // },
  // {
  //   fullname: "production-2",
  //   password: "apaaja",
  //   roles: "production-staff",
  // },
  // {
  //   fullname: "production-2",
  //   password: "apaaja",
  //   roles: "production-admin",
  // },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await user.countDocuments();
    if (existing > 0) {
    } else {
      await user.insertMany(seedData);
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("Gagal seeding:", err);
    process.exit(1);
  }
};

seed();
