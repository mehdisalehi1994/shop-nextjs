"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const AdsSection = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAds = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ads");
        if (!res.ok) throw new Error("خطا در دریافت تبلیغات");
        const data = await res.json();
        if (!mounted) return;
        setAds(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "مشکلی در بارگذاری تبلیغات پیش آمد");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    fetchAds();
    return () => {
      mounted = false;
    };
  }, []);

  // می‌خواهیم همان استایل دو ستون قبلی حفظ شود؛ فقط دو تبلیغ اول را نمایش می‌دهیم
  const firstTwo = ads.slice(0, 2);

  return (
    <section className="mb-3">
      <section className="container-xxl">
        <section className="row py-4">
          {loading ? (
            // اگر خواستی می‌تونیم spinner یا placeholder بذاریم؛ فعلاً متن ساده
            <section className="col-12 text-center">در حال بارگذاری تبلیغات...</section>
          ) : error ? (
            <section className="col-12 text-center text-danger">{error}</section>
          ) : (
            [0, 1].map((idx) => {
              const ad = firstTwo[idx];
              return (
                <section className="col-12 col-md-6 mt-2 mt-md-0" key={idx}>
                  {ad ? (
                    // اگر لینک موجود باشد مستقیم به آن لینک می‌رود؛ در غیر این صورت به مسیر داخلی /ads/:id
                    <a
                      href={ad.link ? ad.link : `/ads/${ad._id}`}
                      target={ad.link ? "_blank" : "_self"}
                      rel={ad.link ? "noreferrer" : undefined}
                      style={{ display: "block" }}
                    >
                      {/* حفظ همان props و کلاس‌های قبلی */}
                      <Image
  src={ad.imageUrl}
  alt={`Advertisement ${idx + 1}`}
  width={800}
  height={300}
  style={{ width: "100%", height: "auto" }} // نسبت تصویر حفظ می‌شود
  className="d-block rounded-2 mx-auto"
/>
                    </a>
                  ) : (
                    // اگر تبلیغی برای این ستون وجود نداشت، یک بلوک خالی با همان استایل نشان بده
                    <div className="d-block rounded-2 w-100" style={{ width: "100%", height: 0, paddingBottom: "25%", background: "#f5f5f5" }} />
                  )}
                </section>
              );
            })
          )}
        </section>
      </section>
    </section>
  );
};

export default AdsSection;
