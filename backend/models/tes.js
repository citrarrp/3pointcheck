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

// const kolomSelectedSchema = new mongoose.Schema({
//   part_name: { type: String, default: null },
//   no_job: { type: String, default: null },
//   dn_number: { type: String, default: null },
//   delivery_date: {
//     type: Date,
//     default: null,
//     set: parseDateSafely,
//   },
//   order_date: {
//     type: Date,
//     default: null,
//     set: parseDateSafely,
//   },
//   delivery_cycle: { type: String, default: null },
//   delivery_time: { type: String, default: null },
//   createdAt: {
//     type: Date,
//     default: date,
//   },
// });

// const cycleSchema = new mongoose.Schema({
//   numberCycle: { type: Number, default: null },
//   departure_time: {
//     type: Date,
//     default: null,
//     set: parseDateSafely,
//   },
// });

const TesSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
  kolomSelected: [
    {
      data: {
        type: mongoose.Schema.Types.Mixed,
        default: undefined,
      },
      createdAt: {
        type: Date,
        default: () => moment().tz("Asia/Jakarta").toDate(),
      },
      selectedData: [String],
      sequence: {
        type: Object,
      },
    },
  ],
  sourceValueLabel: {
    type: mongoose.Schema.Types.Mixed,
    default: undefined,
  },
  separator: {
    type: String,
  },
  selectedColumns: {
    type: [String],
    required: true,
  },
  dataReal: {  
    kanban: {
      type: String,
      default: ""
    },
    kanbanlength: {
      type: Number,
      default: 0
    },
    labelSupplier: {
      type: String,
      default: ""
    },
    labelLength: {
      type: Number,
      default: 0
    }
  },
  selectedCustomer: {
    type: String,
    default: "",
  },
  selectedFields: {
    type: [String],
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: date,
  },
  kanban: {
    type: Boolean,
    default: false,
  },
});

const Tes = mongoose.model("tes", TesSchema, "tes");
export default Tes;
