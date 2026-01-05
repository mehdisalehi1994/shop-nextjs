import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comments";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const id = params.id;

  try {
    const deleted = await Comment.findByIdAndDelete(id);

    if (!deleted) {
      return new NextResponse(
        JSON.stringify({ message: "نظر پیدا نشد" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "نظر با موفقیت حذف شد ✅" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "خطا در حذف نظر" }),
      { status: 500 }
    );
  }
}