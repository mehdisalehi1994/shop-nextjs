import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comments";
import { NextResponse } from "next/server";

/**
 * GET: دریافت لیست نظرات
 * POST: ثبت دیدگاه جدید (isApproved:false)
 * PATCH: بروز‌رسانی وضعیت تایید
 */

export async function GET() {
  try {
    await connectToDatabase();

    const comments = await Comment.find()
      .populate({ path: "userId", select: "name phone" })
      .populate({ path: "productId", select: "name" })
      .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور در دریافت نظرات" }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { productId, userId, text } = await request.json();

    if (!productId || !userId || !text || text.trim().length < 3) {
      return new NextResponse(
        JSON.stringify({ message: "فیلدهای productId, userId و text (حداقل ۳ کاراکتر) الزامی هستند." }),
        { status: 400 }
      );
    }

    // ساخت کامنت جدید با isApproved=false
    const newComment = await Comment.create({
      productId,
      userId,
      text: text.trim(),
      isApproved: false,
    });

    // اصلاح populate با findById
    const populatedComment = await Comment.findById(newComment._id)
      .populate({ path: "userId", select: "name phone" })
      .populate({ path: "productId", select: "name" });

    return new NextResponse(JSON.stringify(populatedComment), { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور در ثبت دیدگاه" }),
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectToDatabase();
    const { id, isApproved } = await request.json();

    if (!id || typeof isApproved !== "boolean") {
      return new NextResponse(
        JSON.stringify({ message: "فیلدهای ID و وضعیت تایید الزامی است." }),
        { status: 400 }
      );
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { isApproved: isApproved },
      { new: true }
    );

    if (!updatedComment) {
      return new NextResponse(JSON.stringify({ message: "نظر پیدا نشد." }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(updatedComment), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error.message || "خطای سرور در به‌روزرسانی وضعیت" }),
      { status: 500 }
    );
  }
}
