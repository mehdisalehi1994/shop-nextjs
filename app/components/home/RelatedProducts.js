"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RelatedProducts = ({ categoryId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/home/related?category=${categoryId}`
        );
        if (!response.ok) {
          throw new Error("خطا در دریافت کالاهای مرتبط");
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("داده‌های نامعتبر دریافت شد");
        }
        setRelatedProducts(data);
      } catch (error) {
        setError("خطا در دریافت کالاهای مرتبط");
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedProducts();
  }, [categoryId]);

  useEffect(() => {
    if (relatedProducts.length > 0) {
      $(".owl-carousel").owlCarousel({
        items: 4,
        loop: true,
        autoplay: true,
        rtl: true,
        responsive: {
          0: {
            items: 1,
          },
          576: {
            items: 2,
          },
          768: {
            items: 3,
          },
          992: {
            items: 4,
          },
        },
      });
    }
  }, [relatedProducts]);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="mb-4">
      <section className="container-xxl">
        <section className="row">
          <section className="col">
            <section className="content-wrapper bg-white p-3 rounded-2">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>کالاهای مرتبط</span>
                  </h2>
                  <section className="content-header-link"></section>
                </section>
              </section>

              <section className="lazyload-wrapper">
                <section className="lazyload light-owl-nav owl-carousel owl-theme">
                  {relatedProducts.map((relatedProduct) => {
                    return (
                      <section className="item" key={relatedProduct._id}>
                        <section className="lazyload-item-wrapper">
                          <section className="product">
                            <Link
                              className="product-link"
                              href={`/products/${relatedProduct._id}`}
                            >
                              <section className="product-image">
                                <Image
                                  src={relatedProduct.imageUrl}
                                  alt="تصویر محصول مرتبط"
                                  width={200}
                                  height={200}
                                />
                              </section>
                              <section className="product-name">
                                <h3>{relatedProduct.name}</h3>
                              </section>
                              <section className="product-price-wrapper">
                                <section className="product-price">
                                  تومان {relatedProduct.price.toLocaleString()}
                                </section>
                              </section>
                            </Link>
                          </section>
                        </section>
                      </section>
                    );
                  })}
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default RelatedProducts;
