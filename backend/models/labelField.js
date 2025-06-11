import mongoose from "mongoose";

const labelFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const labelField = mongoose.model(
  "labelField",
  labelFieldSchema,
  "label_field"
);
export default labelField;
