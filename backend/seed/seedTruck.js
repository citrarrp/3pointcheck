import mongoose from "mongoose";
import dotenv from "dotenv";
import trucks from "../models/truck.js";

dotenv.config({ path: ".env" });

const seedData = [
  {
    truckName: "KAYABA",
    typeTruck: "Direct",
    route: "Route 1",
    destination: "Destination A",
    customerId: "6812f3ce2edc2d8ad9839085",
    cycleNumber: 1,
  },
  {
    truckName: "OTICS",
    typeTruck: "Direct",
    route: "Route 2",
    destination: "Destination B",
    customerId: "6812f3ce2edc2d8ad9839088",
    cycleNumber: 1,
  },
  // {
  //   truckName: "ADM",
  //   typeTruck: "Milkrun",
  //   route: "Route 1",
  //   destination: "Destination A",
  //   customerId: "1",
  //   cycleNumber: 1,
  // },
  // {
  //   truckName: "AHM",
  //   typeTruck: "Milkrun",
  //   route: "Route 2",
  //   destination: "Destination B",
  //   customerId: "2",
  //   cycleNumber: 1,
  // },
  {
    truckName: "KAYABA",
    typeTruck: "Milkrun",
    route: "Route 3",
    destination: "Destination C",
    customerId: "6812f3ce2edc2d8ad9839085",
    cycleNumber: 1,
  },
  {
    truckName: "OTICS",
    typeTruck: "Milkrun",
    route: "Route 3",
    destination: "Destination C",
    customerId: "6812f3ce2edc2d8ad9839088",
    cycleNumber: 1,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await trucks.countDocuments();
    if (existing > 0) {
      console.log("absensi sudah ada. Skip seeding.");
    } else {
      await trucks.insertMany(seedData);
      console.log("Seeding user berhasil!");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("Gagal seeding:", err);
    process.exit(1);
  }
};

seed();
