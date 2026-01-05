import connectToDatabase from "@/app/lib/db";
import Order from "@/models/Order";

export async function GET(req) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const amount = Number(searchParams.get("amount"));

    if (!orderId || isNaN(amount)) {
      return new Response(JSON.stringify({ message: "پارامترهای پرداخت نامعتبر هستند" }), { status: 400 });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return new Response(JSON.stringify({ message: "سفارش پیدا نشد" }), { status: 404 });
    }

    if (order.total !== amount) {
      return new Response(JSON.stringify({ message: "مبلغ پرداخت با مبلغ سفارش همخوانی ندارد" }), { status: 400 });
    }

    // ====== اینجا باید با درگاه واقعی جایگزین شود ======
    // مثال ساخت لینک زرین‌پال / آی دی پی / هر درگاه
    const fakePaymentLink = `https://payment-gateway.example.com/pay?orderId=${order._id}&amount=${order.total}`;

    return new Response(JSON.stringify({ success: true, paymentLink: fakePaymentLink }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || "خطای سرور" }), { status: 500 });
  }
}
