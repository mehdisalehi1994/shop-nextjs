import connectToDatabase from "@/app/lib/db";
import Discount from "@/models/Discount";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = params;
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return new Response(JSON.stringify({ message: "کد تخفیف پیدا نشد" }), { status: 404 });
    }
    return new Response(JSON.stringify(discount), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "خطای سرور" }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();
  const { id } = params;
  try {
    const { code, discountPercentage, expirationDate, isActive } = await request.json();

    const discount = await Discount.findById(id);
    if (!discount) {
      return new Response(JSON.stringify({ message: "کد تخفیف پیدا نشد" }), { status: 404 });
    }

    if (!code || typeof code !== "string" || code.trim() === "") {
      return new Response(JSON.stringify({ message: "کد تخفیف الزامی است" }), { status: 400 });
    }

    const existing = await Discount.findOne({ code: code.trim(), _id: { $ne: id } });
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

    discount.code = code.trim();
    discount.discountPercentage = percentage;
    discount.expirationDate = new Date(expirationDate);
    discount.isActive = Boolean(isActive); // ✅ تغییر اصلی

    await discount.save();

    return new Response(JSON.stringify(discount), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "خطای سرور" }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const { id } = params;
  try {
    const deleted = await Discount.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: "کد تخفیف پیدا نشد" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "کد تخفیف با موفقیت حذف شد" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "خطا در حذف کد تخفیف" }), { status: 500 });
  }
}
