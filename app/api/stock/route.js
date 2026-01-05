import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// دریافت لیست محصولات با شناسه، نام و موجودی
export async function GET() {
  try {
    await connectToDatabase();
    
    // فقط فیلدهای مورد نیاز را انتخاب می‌کنیم: _id, name, stock
    const products = await Product.find({}, '_id name stock').sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور در دریافت موجودی" }),
      { status: 500 }
    );
  }
}

// به‌روزرسانی موجودی (Stock) یک محصول
export async function PUT(request) {
  try {
    await connectToDatabase();
    const { id, stock } = await request.json();

    if (!id || typeof stock === 'undefined' || isNaN(stock)) {
      return new NextResponse(
        JSON.stringify({ message: "شناسه محصول و مقدار موجودی الزامی است." }),
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { stock: Number(stock) },
      { new: true, runValidators: true } // runValidators برای اعمال ولیدیشن‌های مدل
    );

    if (!updatedProduct) {
      return new NextResponse(
        JSON.stringify({ message: "محصول پیدا نشد." }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "موجودی محصول با موفقیت به‌روزرسانی شد ✅", product: updatedProduct }),
      { status: 200 }
    );
  } catch (error) {
    let message = error.message;
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(val => val.message);
        message = errors.join(', ');
    }
    
    return new NextResponse(
      JSON.stringify({ message: message || "خطای سرور در به‌روزرسانی موجودی" }),
      { status: 500 }
    );
  }
}