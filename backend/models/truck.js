import mongoose from "mongoose";
// const CycleStepSchema = new mongoose.Schema(
//   {
//     cycleNumber: {
//       type: String,
//       required: true,
//     },
//     loadingTime: Date,
//     ETA: Date,
//     ETD: Date,
//     ETA_Cust: Date,
//   },
//   { _id: false }
// );

const TruckSchema = new mongoose.Schema({
  partnerName: {
    type: String,
    required: true,
  },
  route: {
    type: String,
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
  // cycleSteps: [CycleStepSchema],
  // lastSyncFromSOD: {
  //   type: Date,
  //   default: null,
  // },
  ETACust: String,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tes",
    required: true,
  },
});

const trucks = mongoose.model("trucks", TruckSchema, "trucks");
export default trucks;
