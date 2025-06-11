import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import customerRoutes from "./routes/customer.router.js";
import dataRoutes from "./routes/data.router.js";
import inputQRRoutes from "./routes/inputQR.router.js";
import fieldRoutes from "./routes/label.router.js";
import userRoutes from "./routes/user.router.js";
import AbsensiRoutes from "./routes/absensi.router.js";
import trackingRoutes from "./routes/tracking.router.js";

dotenv.config({ path: ".env" });

const app = express();
app.use(cors());
app.use(express.json());

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "MongoDB Connected",
      mongoose.connection.host,
      mongoose.connection.db.databaseName
    );

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Collections in DB:");
    collections.forEach((collection) => {
      console.log("- " + collection.name);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

app.use("/api/customer", customerRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/inputQR", inputQRRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/user", userRoutes);
app.use("/api/absensi", AbsensiRoutes);
app.use("/api/track", trackingRoutes);

app.listen(5000, () => {
  db();
  console.log("Server listening on port 5000");
});

// import express from "express";
// import dotenv from "dotenv";
// import path from "path";
// import cors from 'cors';
// import { connectDB } from "./config/db.js";

// import customerRoutes from "./routes/customer.router.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

// app.use(cors());
// app.use(express.json());

// app.use("/api/customer", customerRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// app.listen(PORT, () => {
//   connectDB();
//   console.log("Server started at http://localhost:" + PORT);
// });
