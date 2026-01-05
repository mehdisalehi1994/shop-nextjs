import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";  
import Category from "@/models/Category";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    if(!categoryId)
    {
        return NextResponse.json({ message: "شناسه دسته‌بندی ارائه نشده است" }, { status: 400 });
    }



  
  await connectToDatabase();

  try {

const relatedProducts = await Product.find({ category: categoryId }).limit(10).select("name price imageUrl");
if (!relatedProducts) {
  return NextResponse.json({ message: "محصول یافت نشد" }, { status: 404 });
}
 return NextResponse.json( relatedProducts );
  }
    catch (error) {
return NextResponse.json({ message: "خطا در دریافت محصول" }, { status: 500 });
    }
    finally {

    }
}