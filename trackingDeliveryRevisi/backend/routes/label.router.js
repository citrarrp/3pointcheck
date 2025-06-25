import express from "express";

import {
  getFieldLabel,
  createFieldLabel,
  deleteField,
} from "../controllers/labelfield.controller.js";

const router = express.Router();

router.get("", getFieldLabel);
router.post("/", createFieldLabel);
router.delete("/:id", deleteField);

export default router;
