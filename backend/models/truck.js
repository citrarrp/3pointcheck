import mongoose from "mongoose";
// import moment from "moment-timezone";

const TruckSchema = new mongoose.Schema({
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

const trucks = mongoose.model("trucks", TruckSchema, "trucks");
export default trucks;
