import express from "express";
import {
  getTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
} from "../controllers/truck.controller.js";
const router = express.Router();

router.get("", getTrucks);
router.get("/:id", getTruckById);
router.post("/", createTruck);
router.put("/:id", updateTruck);
router.delete("/:id", deleteTruck);

export default router;
