import connectToDatabase from "@/app/lib/db";
import Discount from "@/models/Discount";

export async function GET() {
  await connectToDatabase();
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(discounts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "خطای سرور" }), { status: 500 });
  }
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const { code, discountPercentage, expirationDate, isActive } = await request.json();

    if (!code || typeof code !== "string" || code.trim() === "") {
      return new Response(JSON.stringify({ message: "کد تخفیف الزامی است" }), { status: 400 });
    }

    const existing = await Discount.findOne({ code: code.trim() });
    if (existing) {
      return new Response(JSON.stringify({ message: "این کد تخفیف قبلاً ثبت شده است" }), { status: 400 });
    }

    const percentage = Number(discountPercentage);
    if (isNaN(percentage) || percentage < 5 || percentage > 100) {
      return new Response(JSON.stringify({ message: "درصد تخفیف باید بین ۵ تا ۱۰۰ باشد" }), { status: 400 });
    }

    if (!expirationDate || isNaN(new Date(expirationDate).getTime())) {
      return new Response(JSON.stringify({ message: "تاریخ انقضا نامعتبر است" }), { status: 400 });
    }

    const discount = await Discount.create({
      code: code.trim(),
      discountPercentage: percentage,
      expirationDate: new Date(expirationDate),
      isActive: Boolean(isActive), // ✅ تغییر اصلی
    });

    return new Response(JSON.stringify(discount), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "خطای سرور" }), { status: 500 });
  }
}
