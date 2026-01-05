import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { writeFile } from "fs/promises"; // Node.js
import { join } from "path";

export async function GET(request, { params }) {
  await connectToDatabase();
  const id = params.id;
  try {
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return new Response(
        JSON.stringify({ message: "محصول پیدا نشد" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "خطای سرور" }),
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();
  const id = params.id;

  try {
    const data = await request.formData();
    const name = data.get("name");
    const description = data.get("description");
    const price = Number(data.get("price"));
    const stock = Number(data.get("stock"));
    const category = data.get("category");
    const image = data.get("image");

    const existing = await Product.findById(id);
    if (!existing) {
      return new Response(JSON.stringify({ message: "محصول پیدا نشد" }), { status: 404 });
    }

    if (name) existing.name = name;
    if (description) existing.description = description;
    if (!isNaN(price)) existing.price = price;
    if (!isNaN(stock)) existing.stock = stock;
    if (category) existing.category = category;

    // ذخیره تصویر جدید
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadDir = join(process.cwd(), "public/uploads");
      const filePath = join(uploadDir, image.name);
      await writeFile(filePath, buffer);
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
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ message: "محصول پیدا نشد" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "محصول با موفقیت حذف شد ✅" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "خطا در حذف محصول" }), { status: 500 });
  }
}
