"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "@/app/home/lib/getFeaturedProducts";
import Script from "next/script";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- دریافت محصولات ---
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        if (!Array.isArray(data)) {
          throw new Error("داده های دریافتی معتبر نمی باشد.");
        }
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // --- اجرای Owl Carousel پس از لود jQuery و محصولات ---
  useEffect(() => {
    if (products.length === 0) return;

    const startCarousel = () => {
      if (typeof window === "undefined") return;
      const $ = window.jQuery;

      if ($ && $.fn.owlCarousel) {
        $(".featured-owl-carousel").owlCarousel({
          items: 4,
          loop: true,
          autoplay: true,
          rtl: true,
          nav: true,
          navText: [
            "<i class='fa fa-chevron-left'></i>",
            "<i class='fa fa-chevron-right'></i>",
          ],
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 },
            992: { items: 4 },
          },
        });
      }
    };

    // منتظر لود کامل jQuery بماند
    const interval = setInterval(() => {
      if (window.jQuery && window.jQuery.fn.owlCarousel) {
        startCarousel();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [products]);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در بارگذاری داده ها: {error}</p>;

  return (
    <section className="mb-3">
      {/* CSS های Owl Carousel */}
      <link rel="stylesheet" href="/plugins/owlcarousel/owl.carousel.css" />
      <link
        rel="stylesheet"
        href="/plugins/owlcarousel/owl.theme.default.css"
      />

      {/* بارگذاری jQuery و Owl Carousel */}
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          if (typeof window !== "undefined") {
            window.$ = window.jQuery = window.jQuery || window.$;
          }
        }}
      />

      <Script
        src="/plugins/owlcarousel/owl.carousel.js"
        strategy="afterInteractive"
      />

      <section className="container-xxl">
        <section className="row">
          <section className="col">
            <section className="content-wrapper bg-white p-3 rounded-2">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>پربازدیدترین کالاها</span>
                  </h2>
                  <section className="content-header-link">
                    <a href="/products">مشاهده همه</a>
                  </section>
                </section>
              </section>

              <section className="lazyload-wrapper">
                <section className="lazyload light-owl-nav featured-owl-carousel owl-carousel owl-theme">
                  {products.map((product) => (
                    <section
                      className="item"
                      key={product._id}
                      style={{ width: "100%" }}
                    >
                      <ProductCard product={product} />
                    </section>
                  ))}
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default FeaturedProducts;
