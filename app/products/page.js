"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // تعداد محصولات در هر صفحه

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("خطا در دریافت محصولات از سرور");
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // محاسبه pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <p className="text-center my-5">در حال بارگذاری...</p>;
  if (error) return <p className="text-center my-5 text-danger">{error}</p>;

  return (
    <section className="main-product-wrapper row my-4">
      {currentProducts.map((product) => (
        <section key={product._id} className="col-md-3 p-0">
          <section className="product">
            <section className="product-add-to-cart">
              <a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به سبد خرید">
                <i className="fa fa-cart-plus"></i>
              </a>
            </section>
            <section className="product-add-to-favorite">
              <a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به علاقه مندی">
                <i className="fa fa-heart"></i>
              </a>
            </section>
            <Link href={`/products/${product._id}`} className="product-link">
              <section className="product-image">
                <img src={product.imageUrl} alt={product.name} className="img-fluid" />
              </section>
              <section className="product-name">
                <h3>{product.name}</h3>
              </section>
              <section className="product-price-wrapper">
                <section className="product-price">{product.price.toLocaleString()} تومان</section>
              </section>
            </Link>
          </section>
        </section>
      ))}

      {/* Pagination */}
      <section className="col-12">
        <section className="my-4 d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </section>
      </section>
    </section>
  );
};

export default ProductsPage;
