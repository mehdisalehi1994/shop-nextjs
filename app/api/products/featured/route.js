import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  try {
    const featuredProducts = await Product.find({})
      .sort({ viwes: -1 })
      .limit(4)
      .select("name price imageUrl category viwes");

    // sanitize مسیر تصویر
    const sanitizedProducts = featuredProducts.map(product => {
      const obj = product.toObject();

      // حذف newline و space اضافی
      obj.imageUrl = obj.imageUrl?.trim() || "/uploads/default.jpg";

      // اگر فایل واقعی .jpg است ولی مسیر .webp بود → اصلاح خودکار
      if (obj.imageUrl.endsWith(".webp")) {
        const potentialJpgPath = obj.imageUrl.replace(".webp", ".jpg");
        // مسیر فایل واقعی روی سرور را چک می‌کنیم
        const fs = require("fs");
        const path = require("path");
        const fullPath = path.join(process.cwd(), "public", potentialJpgPath);
        if (fs.existsSync(fullPath)) {
          obj.imageUrl = potentialJpgPath;
        }
      }

      return obj;
    });

    return NextResponse.json(sanitizedProducts, { status: 200 });
  } catch (error) {
    console.error("Featured Products Error:", error);
    return NextResponse.json(
      { error: "مشکلی در دریافت محصولات پر بازدید رخ داده است." },
      { status: 500 }
    );
  }
}
