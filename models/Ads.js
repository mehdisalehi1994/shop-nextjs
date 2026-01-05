import mongoose from "mongoose";

const AdSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);
