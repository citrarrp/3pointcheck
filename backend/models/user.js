import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  npk: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    // enum: ["user"]
  },
  dept: {
    type: String,
  },
});

const user = mongoose.model("user", userSchema, "user");
export default user;
