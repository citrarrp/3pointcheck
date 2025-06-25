import mongoose from "mongoose";
import moment from "moment-timezone";

const date = () => moment().tz("Asia/Jakarta").toDate();

const parseDateSafely = (val) => {
  if (!val || typeof val !== "string") return null;

  const date = moment.tz(
    val,
    ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
    true,
    "Asia/Jakarta"
  );
  return date.isValid() ? date.toDate() : null;
};

const AbsensiSchema = new mongoose.Schema({
  truckName: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  typeTruck: {
    type: String,
    enum: ["Milkrun", "Direct"],
    required: true,
  },
  scanType: {
    type: String,
    enum: ["In", "Out"],
    default: undefined,
  },
  timestamp: {
    type: Date,
    default: date,
    set: parseDateSafely,
  },
  waktuStandar: {
    type: Date,
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: undefined,
  },
  status: {
    type: String,
    enum: ["Advanced", "On Time", "Delay"],
    default: undefined,
  },
  nonce: {
    type: String,
    default: undefined,
  },
  customerId: {
    type: mongoose.ObjectId,
    ref: "tes",
    required: true,
  },
  cycleNumber: {
    type: Number,
    required: true,
  },
});

const Absensi = mongoose.model("absensi", AbsensiSchema, "absensi");
export default Absensi;
