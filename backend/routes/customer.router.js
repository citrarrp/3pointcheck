import express from "express";

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", getCustomer);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
