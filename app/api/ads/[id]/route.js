import connectToDatabase from "@/app/lib/db";
import Ads from "@/models/Ads";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

export async function GET(request, { params }) {
  await connectToDatabase();
  const id = params.id;
  try {
    const ads = await Ads.findById(id);
    if (!ads) {
      return new Response(JSON.stringify({ message: "تبلیغ پیدا نشد" }), { status: 404 });
    }
    return new Response(JSON.stringify(ads), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "خطای سرور" }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();
  const id = params.id;
  try {
    const data = await request.formData();
    const link = data.get("link");
    const image = data.get("image");

    const existing = await Ads.findById(id);
    if (!existing) {
      return new Response(JSON.stringify({ message: "تبلیغ پیدا نشد" }), { status: 404 });
    }

    if (link) existing.link = link;

    // اگر تصویر جدید آپلود شد -> ذخیره جدید و حذف فایل قبلی
    if (image && image.size > 0) {
      // ذخیره فایل جدید
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, image.name);
      await writeFile(filePath, buffer);

      // حذف فایل قبلی اگر وجود داشت
      if (existing.imageUrl) {
        try {
          const prevPath = existing.imageUrl.replace(/^\//, ""); // برداشتن اسلش اول
          const fullPrevPath = join(process.cwd(), "public", prevPath);
          await unlink(fullPrevPath).catch(() => {});
        } catch (err) {
          // نادیده گرفتن خطا در حذف فایل قبلی
        }
      }

      existing.imageUrl = `/uploads/${image.name}`;
    }

    const updated = await existing.save();
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "خطای سرور" }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const id = params.id;
  try {
    const deleted = await Ads.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: "تبلیغ پیدا نشد" }), { status: 404 });
    }

    // حذف فایل تصویر مرتبط
    if (deleted.imageUrl) {
      try {
        const imgRelPath = deleted.imageUrl.replace(/^\//, "");
        const fullPath = join(process.cwd(), "public", imgRelPath);
        await unlink(fullPath).catch(() => {});
      } catch (err) {
        // ignore
      }
    }

    return new Response(JSON.stringify({ message: "تبلیغ با موفقیت حذف شد ✅" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "خطا در حذف تبلیغ" }), { status: 500 });
  }
}
