
"use client";
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/app/context/CartContext";
import LogoutButton from "@/app/components/auth/LogoutButton";
import { getCategorize } from "@/app/home/lib/getCategorize";
import { Button } from "react-bootstrap";
const Header = () => {
  const [categorize, setCategorize] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const [categoryProducts, setCategoryProducts] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchDebounceRef = useRef(null);

  const { data: session } = useSession();
useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  // واکشی دسته‌ها
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const data = await getCategorize({ signal: controller.signal });
        setCategorize(data || []);
      } catch (err) {
        if (err.name !== "AbortError")
          console.error("خطا در واکشی دسته‌ها:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  // واکشی محصولات هر دسته
  const fetchProductsForCategory = async (categoryId) => {
    if (!categoryId) return [];
    if (categoryProducts[categoryId]) return categoryProducts[categoryId];

    try {
      const res = await fetch(`/api/products?category=${categoryId}`);
      const data = await res.json();
      const products = Array.isArray(data) ? data : [];
      setCategoryProducts((prev) => ({
        ...prev,
        [categoryId]: products.slice(0, 10),
      }));
      return products.slice(0, 10);
    } catch (err) {
      console.warn("خطا در واکشی محصولات دسته:", err);
      setCategoryProducts((prev) => ({ ...prev, [categoryId]: [] }));
      return [];
    }
  };

  // هندلر hover دسته‌ها
  const handleCategoryMouseEnter = (categoryId) => {
    clearTimeout(hoverTimeoutRef.current);

    if (categoryProducts[categoryId]) {
      setHoveredCategory(categoryId);
      return;
    }

    hoverTimeoutRef.current = setTimeout(async () => {
      setHoveredCategory(categoryId);
      await fetchProductsForCategory(categoryId);
    }, 120);
  };

  const handleCategoryMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 250);
  };

  // جستجو
  const performSearch = async (q) => {
    if (!q || q.trim() === "") {
      setSearchResults([]);
      setSearchVisible(false);
      return;
    }
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      const filtered = items.filter((p) =>
        p.name.toLowerCase().includes(q.trim().toLowerCase())
      );
      setSearchResults(filtered.slice(0, 8));
      setSearchVisible(filtered.length > 0);
    } catch (err) {
      console.warn("خطا در جستجو:", err);
      setSearchResults([]);
      setSearchVisible(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => performSearch(value), 350);
  };

  const handleSearchFocus = () => {
    if (searchResults.length > 0) setSearchVisible(true);
  };
  const handleSearchBlur = () => {
    setTimeout(() => setSearchVisible(false), 150);
  };

  const productLink = (p) => `/product/${p._id}`;

  return (
    <header className="header mb-4">
      {/* هدر بالایی */}
      <section className="top-header">
        <section className="container-xxl">
          <section className="d-md-flex justify-content-md-between align-items-md-center py-3">
            <section className="d-flex justify-content-between align-items-center d-md-block">
              <Link href="/">
                <Image
                  src="/images/logo/logo 9.png"
                  width={135}
                  height={48}
                  alt="Logo"
                  priority
                />
              </Link>
              <button
                className="btn btn-link text-dark d-md-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasExample"
              >
                <i className="fa fa-bars me-1"></i>
              </button>
            </section>

            {/* جستجو */}
            <section
              className="mt-3 mt-md-auto search-wrapper"
              style={{ position: "relative" }}
            >
              <section className="search-box">
                <section className="search-textbox">
                  <span>
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="جستجو ..."
                    value={query}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                </section>
                {searchVisible && (
                  <section
                    className="search-result"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      zIndex: 9999,
                      background: "#fff",
                      borderRadius: 6,
                      padding: 8,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    }}
                  >
                    {searchResults.length === 0 ? (
                      <div className="p-2 text-muted">موردی یافت نشد</div>
                    ) : (
                      searchResults.map((p) => (
                        <div key={p._id} className="p-2">
                          <Link
                            href={productLink(p)}
                            className="text-decoration-none text-dark"
                          >
                            {p.name}
                          </Link>
                        </div>
                      ))
                    )}
                  </section>
                )}
              </section>
            </section>

            {/* لاگین و سبد خرید */}
            <section className="mt-3 mt-md-auto text-end">
              <div className="d-inline px-md-3">
                <div className="dropdown d-inline">
                  <button
                    className="btn btn-link text-dark dropdown-toggle profile-button"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fa fa-user"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end custom-drop-down">
                    {!session?.user ? (
                      <>
                        <li>
                          <Link className="dropdown-item" href="/auth/register">
                            ثبت نام
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/auth/login">
                            ورود
                          </Link>
                        </li>
                      </>
                    ) : (
                      <ul className="text-decoration-none">
                      <li className=" py-1 px-3 ">
                        <LogoutButton />
                      </li>
                      <li className='px-3 py-3'>
<Button style={{width: "100%"}} variant="success" href="/my-orders">
    لیست  سفارشات
    </Button>
                      </li>
                      </ul>
                    )}
                   
                  </ul>
                </div>
              </div>
<section className="d-inline px-md-3">
  
</section>

              <div className="header-cart d-inline ps-3 border-start position-relative">
                <Link
                  href="/cart"
                  className="btn btn-link position-relative text-dark"
                >
                  <i className="fa fa-shopping-cart"></i>
                  {totalItems > 0 && (
                    <span
                      className="position-absolute start-0 translate-middle badge rounded-pill bg-danger"
                      style={{ top: "80%" }}
                    >
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </section>
          </section>
        </section>
      </section>

      {/* منوی دسته‌ها */}
      <nav className="top-nav">
        <section className="container-xxl">
          <section
            className="d-none d-md-flex justify-content-start position-relative"
            onMouseLeave={handleCategoryMouseLeave}
          >
            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : (
              categorize.map((cat) => (
                <section
                  key={cat._id}
                  className="navbar-item position-relative"
                  onMouseEnter={() => handleCategoryMouseEnter(cat._id)}
                >
                  <a href="#">{cat.name}</a>

                  {/* زیرمنو محصولات */}
                  {/* {hoveredCategory === cat._id && (
                    <section
                      className="category-dropdown"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        minWidth: 260,
                        background: "#fff",
                        borderRadius: 6,
                        padding: 8,
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        zIndex: 9999,
                      }}
                    >
                      {categoryProducts[cat._id] === undefined ? (
                        <div className="p-2 text-muted">در حال بارگذاری...</div>
                      ) : categoryProducts[cat._id].length === 0 ? (
                        <div className="p-2 text-muted">موردی یافت نشد</div>
                      ) : (
                        categoryProducts[cat._id].map((p) => (
                          <div key={p._id} className="p-2">
                            <Link
                              href={`/product/${p._id}`}
                              className="text-decoration-none text-dark"
                            >
                              {p.name}
                            </Link>
                          </div>
                        ))
                      )}
                    </section>
                  )} */}
                </section>
              ))
            )}
          </section>
        </section>
      </nav>
    </header>
  );
};

export default Header;
