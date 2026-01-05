import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";  
import Category from "@/models/Category";

export async function GET(request, {params}) {
  const { id } = await params;
  
  await connectToDatabase();

  try {
if (!id || id.length !== 24) {
  return NextResponse.json({ message: "شناسه محصول نامعتبر است" }, { status: 400 });
}
const product = await Product.findById(id).populate("category", "name").select("name price description imageUrl category stock views");
if (!product) {
  return NextResponse.json({ message: "محصول یافت نشد" }, { status: 404 });
}
 return NextResponse.json( product );
  }
    catch (error) {
return NextResponse.json({ message: "خطا در دریافت محصول" }, { status: 500 });
    }
    finally {

    }
}