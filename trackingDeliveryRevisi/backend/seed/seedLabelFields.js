import mongoose from "mongoose";
import dotenv from "dotenv";
import labelField from "../models/labelField.js";

dotenv.config({ path: ".env" });

const seedData = [
  { label: "Part Name", value: "part_name" },
  { label: "QTY/Packing", value: "qty" },
  { label: "Part No", value: "part_no" },
  { label: "Customer Number", value: "customer_no" },
  { label: "DN Number", value: "dn_number" },
  { label: "Delivery Date", value: "delivery_date" },
  { label: "Order Date", value: "order_date" },
  { label: "Delivery Cycle", value: "delivery_cycle" },
  { label: "Delivery Time", value: "delivery_time" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await labelField.countDocuments();
    if (existing > 0) {
    } else {
      await labelField.insertMany(seedData);
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("Gagal seeding:", err);
    process.exit(1);
  }
};

seed();
