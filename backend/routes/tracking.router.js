import express from "express";
import {
  getCycleDatabyId,
  getDatabyIdCycle,
  getDatabyIdCycleDN,
  getDataTracking,
  postFinishPreparation,
  postReadyToShipping,
  updateFinishPrepareDatabyDNCustCycle,
} from "../controllers/tracking.controller.js";

const router = express.Router();

router.get("/:id/:cycleNumber", getDatabyIdCycle);
router.get("/:id/:cycleNumber/:dn_number", getDatabyIdCycleDN);
router.get("/", getDataTracking);
router.put("/", updateFinishPrepareDatabyDNCustCycle);
router.put("/finish", postFinishPreparation);
router.put("/ready", postReadyToShipping);
router.get("/:id", getCycleDatabyId);
export default router;
