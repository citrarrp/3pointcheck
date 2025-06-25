import express from "express";

import {
  getInputQR,
  createInputQR,
} from "../controllers/qr.controller.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.get("", getInputQR);
router.post("/", createInputQR);
export default router;
