import mongoose from "mongoose";
import labelField from "../models/labelField.js";

export const getFieldLabel = async (req, res) => {
  try {
    const fields = await labelField.find({});
    res.status(200).json({ success: true, data: fields });
  } catch (error) {
    console.log("error in fetching Label Fields:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createFieldLabel = async (req, res) => {
  const { label, value } = req.body;

  try {
    const newFields = new labelField({ label, value });
    await newFields.save();

    res.status(201).json({ success: true, data: newFields });
  } catch (error) {
    console.error("Error saving inputQR:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteField = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid field Id" });
  }

  try {
    await labelField.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "field deleted" });
  } catch (error) {
    console.log("error in deleting Customer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
