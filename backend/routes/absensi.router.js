import express from "express";
import {
  getAbsensibyDate,
  getAbsensiQR,
  getTrucks,
  validateQR,
} from "../controllers/absensi.controller.js";

const router = express.Router();
router.get("/all", getAbsensibyDate);
router.post("/qr", validateQR);
router.get("/trucks", getTrucks);
export default router;
