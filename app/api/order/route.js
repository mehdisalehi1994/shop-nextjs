import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Discount from "@/models/Discount";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await connectToDatabase();

  try {
    // گرفتن سشن (در صورت لاگین بودن)
    const session = await getServerSession({ request: req, ...authOptions });
    const userId = session?.user?.id || null;

    const body = await req.json();
    const { items, discountCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ message: "هیچ محصولی برای سفارش وجود ندارد" }), { status: 400 });
    }

    // دریافت اطلاعات محصولات از دیتابیس
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    if (products.length !== items.length) {
      return new Response(JSON.stringify({ message: "برخی محصولات موجود نیستند" }), { status: 400 });
    }

    // محاسبه subtotal
    let subtotal = 0;
    const orderItems = items.map(i => {
      const product = products.find(p => p._id.toString() === i.productId);
      const qty = Number(i.quantity) || 1;
      const price = Number(product.price) || 0;
      subtotal += price * qty;
      return { product: product._id, quantity: qty, price };
    });

    // اعتبارسنجی کد تخفیف
    let discountAmount = 0;
    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode.trim(), isActive: true }).lean();
      if (discount) {
        const now = new Date();
        if (!discount.expirationDate || new Date(discount.expirationDate) > now) {
          discountAmount = Math.round((subtotal * discount.discountPercentage) / 100);
        }
      }
    }

    const total = subtotal - discountAmount;

    // ذخیره سفارش (اضافه کردن فیلدهایی که فرانت انتظار دارد)
    const orderPayload = {
      user: userId,
      items: orderItems,
      subtotal,
      discountCode: discountCode || null,
      discountAmount,
      total,
      paymentStatus: "pending",
      // فیلدهای مشابه با نام‌هایی که فرانت استفاده می‌کند:
      totalPrice: subtotal,
      discountPrice: discountAmount,
      finalPrice: total,
      status: "pending",
    };

    const order = await Order.create(orderPayload);

    // شبیه‌سازی لینک پرداخت بانکی (اینجا باید با درگاه واقعی جایگزین شود)
    const paymentLink = `/api/payment?orderId=${order._id}&amount=${total}`;

    return new Response(JSON.stringify({ success: true, orderId: order._id, paymentLink }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطای سرور" }), { status: 500 });
  }
}
