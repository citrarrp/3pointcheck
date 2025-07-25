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
  roles: {
    type: String,
    // enum: ["user"]
    required: true,
  },
});

const user = mongoose.model("user", userSchema, "user");
export default user;
