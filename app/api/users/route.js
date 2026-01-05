import connectToDatabase from "@/app/lib/db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

// 1. دریافت لیست کامل کاربران
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 });
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور در دریافت کاربران" }),
      { status: 500 }
    );
  }
}

// 2. ایجاد کاربر جدید
export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, phone, email, isAdmin } = await request.json();

    // اعتبارسنجی اولیه
    if (!name || !phone) {
      return new NextResponse(
        JSON.stringify({ message: "نام و موبایل الزامی میباشد." }),
        { status: 400 }
      );
    }
    
    // ولیدیشن 11 رقمی موبایل
    if (!/^\d{11}$/.test(phone.trim())) {
      return new NextResponse(
        JSON.stringify({ message: "شماره موبایل باید ۱۱ رقم باشد." }),
        { status: 400 }
      );
    }
    
    // بررسی تکراری بودن موبایل
    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return new NextResponse(
        JSON.stringify({ message: "این شماره موبایل قبلاً ثبت شده است." }),
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      isAdmin: isAdmin || false,
    });

    return new NextResponse(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    // گرفتن خطاهای ولیدیشن Mongoose و نمایش آنها
    let message = error.message;
    if (error.code === 11000) {
      message = "شماره موبایل تکراری است.";
    } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(val => val.message);
        message = errors.join(', ');
    }
    
    return new NextResponse(
      JSON.stringify({ message: message || "خطای سرور" }),
      { status: 500 }
    );
  }
}