"use client";

import React, { useEffect, useState } from "react";

function formatNumber(n) {
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
}

export default function DiscountApply({ productPrice, productId }) {
  // productPrice باید عدد خام (مثلاً 500000) باشد
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);
  const [discountPct, setDiscountPct] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);
  const originalPriceNum = typeof productPrice === "number" ? productPrice : Number(productPrice) || 0;

  useEffect(() => {
    // اگر صفحه عنصر دکمه افزودن به سبد با id="next-level" دارد، مقدار نهایی را در data attribute قرار می‌دهیم
    const btn = document.getElementById("next-level");
    if (btn && applied && finalPrice != null) {
      btn.dataset.finalPrice = String(finalPrice);
      // همچنین در localStorage ثبت می‌کنیم تا هر اسکریپتی که به آن دسترسی دارد بتواند استفاده کند
      localStorage.setItem("appliedDiscount", JSON.stringify({
        productId: productId || null,
        code,
        discountPct,
        finalPrice
      }));
    }
  }, [applied, finalPrice, code, discountPct, productId]);

  // درگاه نمایش قیمت در DOM را بروزرسانی می‌کنیم (ظاهر)
  useEffect(() => {
    const container = document.querySelector(".cart-total-price");
    if (!container) return;
    // پاکسازی از قبل
    const existing = container.querySelector(".discount-preview");
    if (existing) existing.remove();

    if (applied && finalPrice != null) {
      const wrap = document.createElement("div");
      wrap.className = "discount-preview mt-2";
      wrap.style.direction = "rtl";

      const oldPrice = document.createElement("div");
      oldPrice.innerText = `${formatNumber(originalPriceNum)} تومان`;
      oldPrice.style.textDecoration = "line-through";
      oldPrice.style.opacity = "0.6";
      oldPrice.style.marginBottom = "6px";

      const newPrice = document.createElement("div");
      newPrice.innerHTML = `<strong style="font-size:1.1rem">${formatNumber(finalPrice)} تومان</strong>`;

      wrap.appendChild(oldPrice);
      wrap.appendChild(newPrice);

      // قرار دادن قبل از دکمه افزودن به سبد
      const anchor = container.querySelector("a#next-level");
      if (anchor && anchor.parentElement) {
        anchor.parentElement.insertBefore(wrap, anchor);
      } else {
        container.appendChild(wrap);
      }
    }
  }, [applied, finalPrice, originalPriceNum]);

  // تابع ارسال به API اعتبارسنجی
  async function handleApply(e) {
    e?.preventDefault?.();
    setMessage(null);
    setError(null);

    const trimmed = (code || "").trim();
    if (!trimmed) {
      setError("لطفاً کد تخفیف را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, price: originalPriceNum }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        // حالت‌هایی مثل not found / expired / inactive
        if (data && data.reason === "expired") {
          setError("این کد منقضی شده است");
        } else if (data && data.reason === "inactive") {
          setError("این کد غیرفعال است");
        } else if (data && data.reason === "not_found") {
          setError("کد تخفیف اشتباه است");
        } else {
          setError(data?.message || "خطا در ارتباط با سرور");
        }
        setLoading(false);
        return;
      }

      if (data && data.valid) {
        setDiscountPct(data.discountPercentage ?? null);
        if (typeof data.finalPrice === "number") {
          setFinalPrice(data.finalPrice);
        } else {
          // اگر سرور finalPrice نفرستاد (مثلاً در آینده) خودمان محاسبه کنیم
          const pct = Number(data.discountPercentage) || 0;
          setFinalPrice(Math.round(originalPriceNum * (1 - pct / 100)));
        }
        setApplied(true);
        setMessage(`تخفیف ${data.discountPercentage}% اعمال شد.`);
        setError(null);

        // ثبت محلی برای استفاده توسط سایر اسکریپت‌ها / ارسال به سبد خرید
        localStorage.setItem("appliedDiscount", JSON.stringify({
          productId: productId || null,
          code: data.code || trimmed,
          discountPct: data.discountPercentage,
          finalPrice: typeof data.finalPrice === "number" ? data.finalPrice : Math.round(originalPriceNum * (1 - (data.discountPercentage || 0) / 100))
        }));

        // همچنین دکمه افزودن به سبد را به‌روزرسانی می‌کنیم تا اگر JS دیگری قیمت را از data-final-price خواند، مقدار جدید را ببیند.
        const addBtn = document.getElementById("next-level");
        if (addBtn) {
          addBtn.dataset.finalPrice = String(typeof data.finalPrice === "number" ? data.finalPrice : Math.round(originalPriceNum * (1 - (data.discountPercentage || 0) / 100)));
        }
      } else {
        setError(data?.message || "کد نامعتبر است");
        setApplied(false);
      }
    } catch (err) {
      setError(err.message || "خطای شبکه");
      setApplied(false);
    } finally {
      setLoading(false);
    }
  }

  // در صورتی که کاربر دکمه افزودن به سبد را بزند، اگر تخفیف اعمال شده، ما آن رو در localStorage ثبت می‌کنیم
  useEffect(() => {
    const handleClick = (ev) => {
      const addBtn = document.getElementById("next-level");
      if (!addBtn) return;
      // اگر تخفیف اعمال شده، ما قبل از هر کاری اطلاعات را در localStorage می‌گذاریم
      if (applied && finalPrice != null) {
        localStorage.setItem("appliedDiscountBeforeAdd", JSON.stringify({
          productId: productId || null,
          code,
          discountPct,
          finalPrice
        }));
        // همچنین یک event عمومی ایجاد می‌کنیم در صورتیکه سایر اسکریپت‌ها گوش بدهند
        window.dispatchEvent(new CustomEvent("discountAppliedBeforeAdd", {
          detail: { productId: productId || null, code, discountPct, finalPrice }
        }));
      }
      // اجازه می‌دهیم اکشن اصلی دکمه ادامه پیدا کند (ما ورود/پست به سبد را تغییر نمیدهیم)
    };

    const addBtn = document.getElementById("next-level");
    if (addBtn) {
      addBtn.addEventListener("click", handleClick);
    }
    return () => {
      if (addBtn) addBtn.removeEventListener("click", handleClick);
    };
  }, [applied, finalPrice, code, discountPct, productId]);

  return (
    <div>
      <div>
        <p className="text-muted">آیا کد تخفیف دارید؟</p>
        <div style={{ display: "d-flex", gap: 8 }}>
          <input
            aria-label="discount-code"
            type="text"
            placeholder="کد تخفیف را وارد نمایید"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ flex: 1 }}
          /> 
          <button
            onClick={handleApply}
            className="btn btn-success mt-3"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "در حال بررسی..." : "اعمال"}
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          {error && <div style={{ color: "crimson" }}>{error}</div>}
          {message && <div style={{ color: "green" }}>{message}</div>}
        </div>
      </div>
    </div>
  );
}
