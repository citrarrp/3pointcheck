import mongoose from "mongoose";
import moment from "moment-timezone";

const trackingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.ObjectId,
    ref: "tes",
    required: true,
  },
  cycleNumber: {
    type: Number,
    required: true,
    default: 1,
  },
  dnNumber: {
    type: String,
    required: true,
  },
  tanggal: {
    type: Date,
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  waktuStandar: {
    type: String,
    required: true,
  },
  waktuAktual: {
    type: String,
    default: undefined,
  },
  delay: {
    type: String,
    default: undefined,
  },
  status: {
    type: String,
    enum: ["Delay", "Ontime", "Advanced", "-"],
    default: "-",
  },
  createdAt: {
    type: Date,
    default: moment().tz("Asia/Jakarta").toDate(),
  },
  ket: {
    type: String,
    default: "-",
  },
  persentase: {
    type: Number,
    required: true,
    default: 0,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  shift: {
    type: String,
    default: null,
  },
});

const trackingDelv = mongoose.model(
  "trackingDelivery",
  trackingSchema,
  "trackingDelivery"
);
export default trackingDelv;
