import Category from "@/models/Category";
import connectToDatabase from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDatabase();
    try{
const categorize = await Category.find({}).limit(6).select("name");

return NextResponse.json(categorize, {status: 200});
    }
    catch(error){
        return NextResponse.json({
            error: "مشکلی در  دریافت دسته بندی ها رخ داده است.",
        },
        {
status: 500,
        });
    }
}