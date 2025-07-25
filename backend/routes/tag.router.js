import express from "express";
import { getProduksi, updateProduksi } from "../controllers/tag.controller.js";
const router = express.Router();

router.post("/update", updateProduksi);
router.get("/", getProduksi);

export default router;
