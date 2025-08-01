import express from "express";
import { protect } from "../middleware/middleware.js";
import {
  getMaterial,
  createMaterial,
  deleteMaterial,
  updateCustomerMaterialDesc,
} from "../controllers/partMaterial.controller.js";

const router = express.Router();

router.get("/", getMaterial);
router.post("/", createMaterial);
router.delete("/:id", deleteMaterial);
// router.put("/update", updateCustomerMaterialDesc);

export default router;
