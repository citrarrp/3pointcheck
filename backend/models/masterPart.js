import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    //   customerId: {
    //     type: mongoose.ObjectId,
    //     ref: "tes",
    //     required: true,
    //   },
    // sales_organization: {
    //   type: String,
    // },
    // distribution_channel: {
    //   type: String,
    // },
    customer: {
      type: String,
    },
    customer_description: {
      type: String,
    },
    material: {
      type: String,
      required: true,
    },
    // created_by: {
    //   type: String,
    // },
    unique: {
      type: String,
    },
    created_on: {
      type: Date,
      default: Date.now,
    },
    customer_material: {
      type: String,
      required: true,
    },
    // customer_material_description: {
    //   type: String,
    // },
    // minimum_delivery_qty: {
    //   type: Number,
    //   default: 0,
    // },
    // base_unit_of_measure: {
    //   type: String,
    // },
    qtyKanban: {
      type: Number,
      default: 0,
    },
    // sap_number: {
    //   type: String,
    //   required: true,
    // },
    job_no: {
      type: String,
    },
    material_description: {
      type: String,
      required: true,
    },
    line: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const materialCustomer = mongoose.model(
  "materialCustomer",
  materialSchema,
  "materialCustomer"
);
export default materialCustomer;
