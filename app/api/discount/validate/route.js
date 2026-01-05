import connectToDatabase from "@/app/lib/db";
import Discount from "@/models/Discount";

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { code, price } = body || {};

    if (!code || typeof code !== "string" || code.trim() === "") {
      return new Response(JSON.stringify({ valid: false, message: "کد تخفیف لازم است" }), { status: 400 });
    }

    const trimmed = code.trim();
    // جستجو بدون توجه به حروف بزرگ/کوچک
    const discount = await Discount.findOne({
      code: { $regex: `^${escapeRegex(trimmed)}$`, $options: "i" },
    }).lean();

    if (!discount) {
      return new Response(JSON.stringify({ valid: false, reason: "not_found", message: "کد تخفیف اشتباه است" }), { status: 404 });
    }

    if (!discount.isActive) {
      return new Response(JSON.stringify({ valid: false, reason: "inactive", message: "این کد غیرفعال است" }), { status: 400 });
    }

    const now = new Date();
    if (discount.expirationDate && new Date(discount.expirationDate).getTime() <= now.getTime()) {
      return new Response(JSON.stringify({ valid: false, reason: "expired", message: "این کد منقضی شده است" }), { status: 400 });
    }

    // price می‌تواند از client بیاید؛ در صورت نبودن، فقط درصد را برگردان
    const pct = Number(discount.discountPercentage) || 0;
    let finalPrice = null;
    if (typeof price === "number" && !isNaN(price)) {
      finalPrice = Math.round(price * (1 - pct / 100));
      if (finalPrice < 0) finalPrice = 0;
    }

    return new Response(
      JSON.stringify({
        valid: true,
        discountPercentage: pct,
        finalPrice,
        message: "کد معتبر است",
        discountId: discount._id,
        code: discount.code,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ valid: false, message: error.message || "خطای سرور" }), { status: 500 });
  }
}
