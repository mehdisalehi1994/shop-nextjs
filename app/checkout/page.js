"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountMessage, setDiscountMessage] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [orderLink, setOrderLink] = useState("");

  // ⬇️ اضافه شده
  const [orderSuccess, setOrderSuccess] = useState(false);

  const items = Array.isArray(cart?.items) ? cart.items : [];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      (Number(item.product?.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  function formatNumber(n) {
    try {
      return n.toLocaleString();
    } catch {
      return String(n);
    }
  }

  async function handleApplyDiscount(e) {
    e?.preventDefault?.();
    setDiscountMessage(null);

    const code = (discountInput || "").trim();
    if (!code) {
      setDiscountMessage({
        type: "error",
        text: "لطفاً کد تخفیف را وارد کنید",
      });
      return;
    }

    try {
      const resp = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, price: subtotal }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.valid) {
        setDiscountMessage({
          type: "error",
          text: data.message || "کد تخفیف معتبر نیست",
        });
        setAppliedDiscount(null);
        return;
      }

      setAppliedDiscount({
        code: data.code,
        discountPercentage: data.discountPercentage,
        finalPrice: data.finalPrice,
      });

      setDiscountMessage({
        type: "success",
        text: `تخفیف ${data.discountPercentage}% با موفقیت اعمال شد.`,
      });
    } catch {
      setDiscountMessage({ type: "error", text: "خطا در ارتباط با سرور" });
      setAppliedDiscount(null);
    }
  }

  async function handleOrderSubmit() {
    setLoading(true);
    setOrderLink("");
    try {
      const resp = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product._id,
            quantity: i.quantity,
          })),
          discountCode: appliedDiscount?.code || null,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) throw new Error(data.message || "خطا در ثبت سفارش");

      setOrderLink(data.paymentLink);
      clearCart();

      // ⬇️ اضافه‌شده: پیام موفقیت
      setOrderSuccess(true);

    } catch (err) {
      alert(err.message || "خطا در ثبت سفارش");
    } finally {
      setLoading(false);
    }
  }

  if (!cart || items.length === 0) {
    return (
      <main className="main-body">
        <section className="container-xxl text-center py-5">
          <h4>سبد خرید شما خالی است</h4>
          <Link href="/" className="btn btn-primary mt-3">
            بازگشت به فروشگاه
          </Link>
        </section>
      </main>
    );
  }

  const payableAmount = appliedDiscount?.finalPrice ?? subtotal;

  return (
    <main id="main-body-one-col" className="main-body">
      <section className="mb-4">
        <section className="container-xxl">
          <section className="row">
            <section className="col">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>تکمیل خرید</span>
                  </h2>
                </section>
              </section>

              <section className="row mt-4">
                <section className="col-md-9">
                  <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                    <section className="content-header mb-3">
                      <section className="d-flex justify-content-between align-items-center">
                        <h2 className="content-header-title content-header-title-small">
                          کد تخفیف
                        </h2>
                      </section>
                    </section>

                    <section
                      className="payment-alert alert alert-primary d-flex align-items-center p-2"
                      role="alert"
                    >
                      <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                      <section>کد تخفیف خود را در این بخش وارد کنید.</section>
                    </section>

                    <section className="row">
                      <section className="col-md-5">
                        <section className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="کد تخفیف را وارد کنید"
                            value={discountInput}
                            onChange={(e) => setDiscountInput(e.target.value)}
                          />
                        </section>
                        <button
                          className="btn btn-primary mt-3"
                          type="button"
                          onClick={handleApplyDiscount}
                        >
                          اعمال کد
                        </button>
                        {discountMessage && (
                          <div
                            style={{
                              marginTop: 8,
                              color:
                                discountMessage.type === "error"
                                  ? "crimson"
                                  : "green",
                            }}
                          >
                            {discountMessage.text}
                          </div>
                        )}
                      </section>
                    </section>
                  </section>

                  {items.map((item) => (
                    <section
                      className="cart-item d-md-flex py-3 border-bottom"
                      key={item.product._id}
                    >
                      <section className="align-self-start w-100">
                        <p className="fw-bold">{item.product.name}</p>
                        <p>تعداد : {item.quantity}</p>
                        <p className="fw-bold">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}{" "}
                          تومان
                        </p>
                      </section>
                    </section>
                  ))}
                </section>

                <section className="col-md-3">
                  <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">

                    {/* ⬇️ پیام موفقیت ثبت سفارش */}
                    {orderSuccess && (
                      <div className="alert alert-success mt-2">
                        ثبت سفارش شما با موفقیت انجام شد
                      </div>
                    )}

                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">قیمت کالاها</p>
                      <p className="text-muted">
                        {subtotal.toLocaleString()} تومان
                      </p>
                    </section>

                    <section className="border-bottom mb-3"></section>

                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">تخفیف اعمال شده</p>
                      <p className="text-danger">
                        {appliedDiscount?.finalPrice
                          ? (
                              subtotal - appliedDiscount.finalPrice
                            ).toLocaleString()
                          : 0}{" "}
                        تومان
                      </p>
                    </section>

                    <section className="border-bottom mb-3"></section>

                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">مبلغ قابل پرداخت</p>
                      <p className="fw-bold">
                        {payableAmount.toLocaleString()} تومان
                      </p>
                    </section>

                    <section className="">
                      {orderLink ? (
                        <a
                          href={orderLink}
                          className="btn btn-success d-block mt-3"
                        >
                          پرداخت آنلاین
                        </a>
                      ) : (
                        <button
                          className="mt-3 btn btn-primary"
                          onClick={handleOrderSubmit}
                          disabled={loading}
                        >
                          {loading ? "درحال پردازش ..." : "ثبت سفارش"}
                        </button>
                      )}
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}
