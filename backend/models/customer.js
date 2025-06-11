import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  kolomSelected: [
    {
      data: [mongoose.Schema.Types.Mixed],
      createdAt: { type: Date, default: Date.now },
    },
  ],
  selectedData: [String],
  cycle: [mongoose.Schema.Types.Mixed],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model("customer", customerSchema, "customer");
export default Customer;
