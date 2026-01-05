import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // اگر کاربر لاگین باشد نگهداری شود
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // قیمت واحد در زمان سفارش
      },
    ],
    subtotal: { type: Number, required: true }, // جمع قبل از تخفیف
    discountCode: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true }, // مبلغ نهایی بعد از تخفیف
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    // فیلدهایی که فرانت (my-orders) مستقیماً از آن‌ها استفاده می‌کند:
    totalPrice: { type: Number, default: 0 }, // معمولاً برابر subtotal
    discountPrice: { type: Number, default: 0 }, // معمولاً برابر discountAmount
    finalPrice: { type: Number, default: 0 }, // معمولاً برابر total
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// مطمئن می‌شویم اگر یکی از فیلدهای اصلی پر شد، معادل‌های نمایش داده شده هم همگام شوند
OrderSchema.pre("save", function (next) {
  try {
    if (this.isModified("subtotal") || this.isModified("discountAmount") || this.isModified("total")) {
      // همسان‌سازی فیلدهای نمایشی (در صورت عدم وجود یا اگر 값ها متفاوت باشند)
      if (!this.totalPrice) this.totalPrice = this.subtotal;
      else this.totalPrice = this.subtotal;

      if (!this.discountPrice) this.discountPrice = this.discountAmount;
      else this.discountPrice = this.discountAmount;

      if (!this.finalPrice) this.finalPrice = this.total;
      else this.finalPrice = this.total;
    }

    if (this.isModified("paymentStatus")) {
      this.status = this.paymentStatus;
    } else if (this.isModified("status")) {
      this.paymentStatus = this.status;
    }
  } catch (e) {
    // ignore and continue
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
