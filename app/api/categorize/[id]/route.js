import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";

export async function GET(request, { params }) {
  await connectToDatabase();
  try {
    const category = await Category.findById(params.id);
    if (!category) {
      return new Response(JSON.stringify({ message: "دسته بندی پیدا نشد" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();
  try {
    const body = await request.json();
    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return new Response(
        JSON.stringify({ message: "نام دسته بندی الزامی میباشد" }),
        {
          status: 400,
        }
      );
    }
    if (body.name.length < 3 || body.name.length > 30) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ باشد" }),
        {
          status: 400,
        }
      );
    }
    const category = await Category.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  try {
    const deleted = await Category.findByIdAndDelete(params.id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ message: "دسته‌بندی مورد نظر پیدا نشد" }),
        { status: 404 }
      );
    }

    // ✅ تغییر اصلی: پاسخ با JSON و status 200
    return new Response(
      JSON.stringify({ message: "دسته‌بندی با موفقیت حذف شد ✅" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

