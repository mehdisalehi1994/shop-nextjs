import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find();
  return new Response(JSON.stringify(categories), { status: 200 });
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(
        JSON.stringify({ message: "نام دسته‌بندی الزامی است." }),
        { status: 400 }
      );
    }

    const persianNameRegex = /^[آ-ی\s]{3,30}$/;
    if (!persianNameRegex.test(name.trim())) {
      return new Response(
        JSON.stringify({
          message:
            "نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر و فقط شامل حروف فارسی باشد.",
        }),
        { status: 400 }
      );
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "این نام دسته‌بندی قبلاً ثبت شده است." }),
        { status: 400 }
      );
    }

    const category = await Category.create({ name: name.trim() });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "خطای سرور" }),
      { status: 500 }
    );
  }
}
