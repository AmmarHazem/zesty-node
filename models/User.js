import mongoose from "mongoose";
import validator from "validator";
import { hashPassword } from "../helpers.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "invalid email",
    },
  },
  emailVerificationToken: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationDate: { type: Date },
  locationLat: { type: Number },
  locationLng: { type: Number },
  role: {
    type: String,
    enum: ["customer", "chef", "admin"],
  },
  password: { type: String, required: true, trim: true },
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashPassword({ password: this.password });
  }
});

export default mongoose.model("User", UserSchema);
