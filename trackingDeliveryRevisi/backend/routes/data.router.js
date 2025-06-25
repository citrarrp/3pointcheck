import express from "express";

import {
  getData,
  createData,
  updateData,
  deleteData,
  getDataByName,
  getDatabyId,
  updateDataCycle,
  deleteCycle,
  deleteDataHarian,
  getSelectedCustomer,
} from "../controllers/data.controller.js";

const router = express.Router();

router.get("", getData);
router.get("/:id", getDatabyId);
router.post("/", createData);
router.patch("/:id", updateData);
router.delete("/:id", deleteData);
router.delete("/:id/:idDataHarian", deleteDataHarian);
router.get("/customer/:namaCust", getDataByName);
router.patch("/cycle/:id", updateDataCycle);
router.delete("/:id/:numberCycle", deleteCycle);
router.get("/selectedCust/db", getSelectedCustomer);
export default router;
