"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import "./../styles/cart.css";

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const [loadingItem, setLoadingItem] = useState(null);

  const items = Array.isArray(cart?.items) ? cart.items : [];

  let subtotal = 0;
  for (const item of items) {
    const unitPrice = Number(item.product?.price) || 0;
    const qty = Number(item.quantity) || 0;
    subtotal += unitPrice * qty;
  }

  function formatNumber(n) {
    try {
      return n.toLocaleString();
    } catch {
      return String(n);
    }
  }

  return (
    <main id="main-body-one-col" className="main-body">
      {items.length === 0 ? (
        <section className="container-xxl text-center py-5">
          <h4>سبد خرید شما خالی است</h4>
          <Link href="/" className="btn btn-primary mt-3">
            بازگشت به فروشگاه
          </Link>
        </section>
      ) : (
        <section className="mb-4">
          <section className="container-xxl">
            <section className="row">
              <section className="col">
                <section className="content-header">
                  <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title">
                      <span>سبد خرید شما</span>
                    </h2>
                  </section>
                </section>

                <section className="row mt-4">
                  <section className="col-md-9 mb-3">
                    <section className="content-wrapper bg-white p-3 rounded-2">
                      {items.map((item) => (
                        <section
                          className="cart-item d-md-flex py-3"
                          key={item.product?._id || item._id}
                        >
                          <section className="cart-img align-self-start flex-shrink-1">
                            {item.product?.imageUrl ? (
                              <Image
                                src={item.product?.imageUrl}
                                alt={item.product?.name}
                                width={80}
                                height={80}
                              />
                            ) : (
                              <span>تصویر موجود نیست</span>
                            )}
                          </section>

                          <section className="align-self-start w-100">
                            <p className="fw-bold">
                              {item.product?.name || "نام محصول موجود نیست"}
                            </p>
                            <section>
                              <section className="cart-product-number d-inline-block">
                                <button
                                  className="cart-number-down"
                                  type="button"
                                  disabled={
                                    item.quantity <= 1 ||
                                    loadingItem === item.product?._id
                                  }
                                  onClick={async () => {
                                    setLoadingItem(item.product?._id);
                                    await decreaseQuantity(item.product?._id);
                                    setLoadingItem(null);
                                  }}
                                >
                                  {loadingItem === item.product?._id
                                    ? "..."
                                    : "-"}
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  readOnly
                                />
                                <button
                                  className="cart-number-up"
                                  type="button"
                                  disabled={
                                    item.quantity >=
                                      (item.product?.stock || 0) ||
                                    loadingItem === item.product?._id
                                  }
                                  onClick={async () => {
                                    setLoadingItem(item.product?._id);
                                    await increaseQuantity(item.product?._id);
                                    setLoadingItem(null);
                                  }}
                                >
                                  {loadingItem === item.product?._id
                                    ? "..."
                                    : "+"}
                                </button>
                              </section>
                              <a
                                className="text-decoration-none ms-4 cart-delete"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeFromCart(item.product?._id);
                                }}
                              >
                                <i className="fa fa-trash-alt"></i> حذف از سبد
                              </a>
                            </section>
                          </section>

                          <section className="align-self-end flex-shrink-1">
                            <section className="text-nowrap fw-bold">
                              {formatNumber(
                                (Number(item.product?.price) || 0) *
                                  (Number(item.quantity) || 0)
                              )}{" "}
                              تومان
                            </section>
                          </section>
                        </section>
                      ))}
                    </section>
                  </section>

                  <section className="col-md-3">
                    <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">
                          قیمت کالاها ({items.length})
                        </p>
                        <p className="text-muted">
                          {formatNumber(subtotal)} تومان
                        </p>
                      </section>

                      <section className="border-bottom mb-3"></section>

                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">جمع سبد خرید</p>
                        <p className="fw-bolder">
                          {formatNumber(subtotal)} تومان
                        </p>
                      </section>

                      <p className="my-3">
                        <i className="fa fa-info-circle me-1"></i>کاربر گرامی
                        خرید شما هنوز نهایی نشده است. برای ثبت سفارش و تکمیل
                        خرید باید ابتدا آدرس خود را انتخاب کنید و سپس نحوه ارسال
                        را انتخاب کنید.
                      </p>

                      <section className="">
                        <Link
                          href="/checkout"
                          className="btn btn-danger d-block"
                        >
                          تکمیل فرآیند خرید
                        </Link>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      )}
    </main>
  );
}
