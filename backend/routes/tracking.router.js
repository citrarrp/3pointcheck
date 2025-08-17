import express from "express";
import {
  generateOrGetVerification,
  getCycleDatabyId,
  getDatabyIdCycle,
  getDatabyIdCycleDN,
  getCycleUniqueByDateCust,
  getDataTracking,
  postChecking,
  postFinishPreparation,
  postInspection,
  updateKeterangan,
  updatePrepareDatabyDNCustCycle,
} from "../controllers/tracking.controller.js";

const router = express.Router();

router.get("/:id/:cycleNumber", getDatabyIdCycle);
router.get("/:id/:cycleNumber/:dn_number", getDatabyIdCycleDN);
router.get("/unik", getCycleUniqueByDateCust);
router.get("/", getDataTracking);
router.put("/", updatePrepareDatabyDNCustCycle);
router.put("/finish", postInspection);
router.post("/check", postChecking);
router.post("/getCode", generateOrGetVerification);
router.put("/keterangan/:id", updateKeterangan);
router.put("/ready", postFinishPreparation);
router.get("/:id", getCycleDatabyId);
export default router;
