import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // ریلیشن به مدل Products
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ریلیشن به مدل Users
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [3, "Comment must be at least 3 characters"],
      maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    isApproved: {
      type: Boolean,
      default: false, // وضعیت پیش‌فرض: تایید نشده
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);