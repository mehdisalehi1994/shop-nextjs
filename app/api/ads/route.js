import connectToDatabase from "@/app/lib/db";
import Ads from "@/models/Ads";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";

export async function GET() {
  try {
    await connectToDatabase();
    const ads = await Ads.find().sort({ createdAt: -1 });
    return new NextResponse(JSON.stringify(ads), { status: 200 });
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
    const link = data.get("link");

    if (!file) {
      return NextResponse.json({ success: false, message: "آپلود عکس الزامی میباشد" }, { status: 400 });
    }
    if (!link || link.trim() === "") {
      return NextResponse.json({ success: false, message: "لینک تبلیغ الزامی میباشد" }, { status: 400 });
    }

    // اعتبارسنجی تصویر
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, message: "حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد." }, { status: 400 });
    }

    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json({ success: false, message: "فرمت تصویر معتبر نیست. فقط JPG, PNG, WEBP یا GIF مجاز است." }, { status: 400 });
    }

    // ذخیره فایل
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    await connectToDatabase();

    const ads = await Ads.create({
      imageUrl: `/uploads/${file.name}`,
      link: link.trim(),
    });

    return new NextResponse(JSON.stringify(ads), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.message || "خطای سرور" }), { status: 500 });
  }
}
