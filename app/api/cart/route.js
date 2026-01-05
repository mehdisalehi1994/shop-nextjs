import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function GET(request) {
  await connectToDatabase();
  const session = await getServerSession({ request, ...authOptions });
  if (!session?.user)
    return NextResponse.json(
      { error: "کاربر احراز هویت نشده است" },
      { status: 401 }
    );

  let cart = await Cart.findOne({ user: session.user.id }).populate(
    "items.product"
  );
  if (!cart) {
    cart = new Cart({
      user: session.user.id,
      items: [],
      appliedDiscount: null,
    });
    await cart.save();
  }

  return NextResponse.json(cart);
}

export async function POST(request) {
  await connectToDatabase();
  const session = await getServerSession({ request, ...authOptions });
  if (!session?.user)
    return NextResponse.json(
      { error: "کاربر احراز هویت نشده است" },
      { status: 401 }
    );

  const { productId, quantity } = await request.json();
  if (!productId || isNaN(quantity) || quantity === 0)
    return NextResponse.json(
      { error: "اطلاعات ورودی نامعتبر است" },
      { status: 400 }
    );

  const product = await Product.findById(productId);
  if (!product)
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });

  let cart = await Cart.findOne({ user: session.user.id });
  if (!cart)
    cart = new Cart({
      user: session.user.id,
      items: [],
      appliedDiscount: null,
    });

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else existingItem.quantity = newQuantity;
  } else {
    if (quantity > 0) cart.items.push({ product: productId, quantity });
  }

  // اگر کل سبد خالی شد => حذف کد تخفیف
  if (cart.items.length === 0) cart.appliedDiscount = null;

  await cart.save();
  return NextResponse.json(cart);
}

export async function DELETE(request) {
  await connectToDatabase();
  const session = await getServerSession({ request, ...authOptions });
  if (!session?.user)
    return NextResponse.json(
      { error: "کاربر احراز هویت نشده است" },
      { status: 401 }
    );

  const { productId } = await request.json();
  if (!productId)
    return NextResponse.json(
      { error: "شناسه محصول ارائه نشده است" },
      { status: 400 }
    );

  let cart = await Cart.findOne({ user: session.user.id });
  if (!cart)
    return NextResponse.json(
      { error: "سبد خرید شما خالی است" },
      { status: 404 }
    );

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);

  if (cart.items.length === 0) cart.appliedDiscount = null;

  await cart.save();
  return NextResponse.json(cart);
}
