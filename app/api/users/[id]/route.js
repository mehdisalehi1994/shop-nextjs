import connectToDatabase from "@/app/lib/db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

// 1. دریافت اطلاعات کاربر
export async function GET(request, { params }) {
  await connectToDatabase();
  const id = params.id;
  try {
    const user = await User.findById(id);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "کاربر پیدا نشد" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور" }),
      { status: 500 }
    );
  }
}

// 2. به‌روزرسانی اطلاعات کاربر (شامل تغییر ادمین)
export async function PUT(request, { params }) {
  await connectToDatabase();
  const id = params.id;

  try {
    const updatedData = await request.json();
    const existing = await User.findById(id);

    if (!existing) {
      return new NextResponse(
        JSON.stringify({ message: "کاربر پیدا نشد" }),
        { status: 404 }
      );
    }

    // بررسی تکراری بودن موبایل (اگر تغییر کرده باشد)
    if (updatedData.phone && updatedData.phone !== existing.phone) {
      const phoneExists = await User.findOne({ phone: updatedData.phone, _id: { $ne: id } });
      if (phoneExists) {
        return new NextResponse(
          JSON.stringify({ message: "این شماره موبایل قبلاً ثبت شده است." }),
          { status: 400 }
        );
      }
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true } // runValidators برای اجرای ولیدیشن‌های مدل
    );

    return new NextResponse(JSON.stringify(updated), { status: 200 });
  } catch (error) {
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

// 3. حذف کاربر
export async function DELETE(request, { params }) {
  await connectToDatabase();
  const id = params.id;

  try {
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return new NextResponse(
        JSON.stringify({ message: "کاربر پیدا نشد" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "کاربر با موفقیت حذف شد ✅" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "خطا در حذف کاربر" }),
      { status: 500 }
    );
  }
}