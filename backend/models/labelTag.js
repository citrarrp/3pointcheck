import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    operator: { type: String, required: true },
    waktuUpdated: { type: Date, required: true },
  },
  { _id: false }
);

const labelSchema = new mongoose.Schema(
  {
    // customerId: {
    //   type: mongoose.ObjectId,
    //   ref: "tes",
    //   required: true,
    // },
    customer: {
      type: String,
      // required: true,
    },
    material: {
      type: String,
      required: true,
    },
    history: {
      type: [HistorySchema],
      default: [],
    },
    shift: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    line: {
      type: String,
      //   required: true,
    },
    qty: {
      type: Number,
      // required: true,
    },
    date: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const labelTag = mongoose.model("labelTag", labelSchema, "labelTag");
export default labelTag;
