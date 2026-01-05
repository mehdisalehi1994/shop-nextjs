import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().populate("category");
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور" }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();

    const file = data.get("image");

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "آپلود عکس الزامی میباشد",
      });
    }

    const name = data.get("name");
    const description = data.get("description");
    const price = Number(data.get("price"));
    const stock = Number(data.get("stock"));
    const category = data.get("category");

    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return new NextResponse(
        JSON.stringify({ message: "تمام فیلد ها الزامی میباشد." }),
        { status: 400 }
      );
    }

    const existing = await Product.findOne({ name: name.trim() });
    if (existing) {
      return new NextResponse(
        JSON.stringify({ message: "این نام محصول قبلاً ثبت شده است." }),
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: "حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.",
      });
    }

    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json({
        success: false,
        message:
          "فرمت تصویر معتبر نیست. فقط JPG, PNG, WEBP یا GIF مجاز است.",
      });
    }

    // ذخیره فایل
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads");
    const filePath = join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    await connectToDatabase();

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      imageUrl: `/uploads/${file.name}`,
    });

    return new NextResponse(JSON.stringify(product), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور" }),
      { status: 500 }
    );
  }
}
