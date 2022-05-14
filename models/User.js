import mongoose from "mongoose";
import validator from "validator";
import hashPassword from "../helpers/hashPassword.js";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
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
      required: true,
      enum: ["customer", "chef", "admin"],
    },
    password: { type: String, required: true, trim: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.index({ email: 1 });

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashPassword({ password: this.password });
  }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
