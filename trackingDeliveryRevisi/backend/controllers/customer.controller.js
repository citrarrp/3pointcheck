import mongoose from "mongoose";
import Customer from "../models/customer.js";

export const getCustomer = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.log("error in fetching Customers:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createCustomer = async (req, res) => {
  const customer = req.body;

  if (!customer.nama) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newCustomer = new Customer(customer);

  try {
    await newCustomer.save();
    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error("Error in Create Customer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;

  const Customer = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Customer Id" });
  }

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, Customer, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Customer Id" });
  }

  try {
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Customer deleted" });
  } catch (error) {
    console.log("error in deleting Customer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
