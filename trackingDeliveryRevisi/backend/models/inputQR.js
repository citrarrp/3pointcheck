import { ObjectId } from "bson";
import mongoose from "mongoose";

const scanQRSchema = new mongoose.Schema({
  // customerId: {
  //   type: ObjectId,
  //   required: true,
  // },
  // tanggalScan: {
  //   type: Date,
  //   required: true,
  // },
  kanban: {
    type: String,
    required: true,
  },
  labelSupplier: {
    type: String,
  },
  index: Number,
  status: Boolean,
  sisa: Number,
  customerId: {
    type: mongoose.ObjectId,
    ref: "tes",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  dateDelivery: {
    type: Date,
    default: undefined,
  },
});

const scanQR = mongoose.model("scanQR", scanQRSchema, "scanQR");
export default scanQR;
