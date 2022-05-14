import mongoose from "mongoose";

const oneDay = 1000 * 60 * 60 * 24;

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      default: () => new Date() + oneDay,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

TokenSchema.index({ user: 1 });

TokenSchema.virtual("isValid").get(function () {
  return new Date() < this.expiryDate;
});

export default mongoose.model("Token", TokenSchema);
