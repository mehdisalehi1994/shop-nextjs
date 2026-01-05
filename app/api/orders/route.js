import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(request) {
  try {
   await connectToDatabase();
    const session = await getServerSession({ request, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const orders = await Order.find({ user: session.user.id })
      .populate("items.product", "name imageUrl price")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد" },
      { status: 500 }
    );
  }
}
