"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");

        if (!res.ok) {
          throw new Error("Something went wrong while fetching orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <section className="">
      <section id="main-body-two-col" className="container-xxl body-container">
        <section className="row">
          <aside id="sidebar" className="sidebar col-md-3">
            <section className="content-wrapper p-3 rounded-2 mb-3">
              <section className="sidebar-nav">
                <section className="sidebar-nav-item">
                  <span className="sidebar-nav-item-title">
                    <Link className="p-3" href="/my-orders">
                      سفارش های من
                    </Link>
                  </span>
                </section>
                <section className="sidebar-nav-item">
                  <span className="sidebar-nav-item-title">
                    <a className="p-3" href="my-addresses.html">
                      آدرس های من
                    </a>
                  </span>
                </section>
                <section className="sidebar-nav-item">
                  <span className="sidebar-nav-item-title">
                    <a className="p-3" href="my-favorites.html">
                      لیست علاقه مندی
                    </a>
                  </span>
                </section>
              </section>
            </section>
          </aside>
          <main id="main-body" className="main-body col-md-9">
            <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>تاریخچه سفارشات</span>
                  </h2>
                  <section className="content-header-link"></section>
                </section>
              </section>

              {orders.length === 0 ? (
                <section className="text-center py-5">
                  <h4>هیچ سفارشی یافت نشد</h4>
                </section>
              ) : (
                <section>
                  <section className="d-flex justify-content-center my-4">
                    <a className="btn btn-info btn-sm mx-1" href="#">
                      در انتظار پرداخت
                    </a>
                    <a className="btn btn-warning btn-sm mx-1" href="#">
                      در حال پردازش
                    </a>
                    <a className="btn btn-success btn-sm mx-1" href="#">
                      تحویل شده
                    </a>
                    <a className="btn btn-danger btn-sm mx-1" href="#">
                      مرجوعی
                    </a>
                    <a className="btn btn-dark btn-sm mx-1" href="#">
                      لغو شده
                    </a>
                  </section>

                  <section className="content-header mb-3">
                    <section className="d-flex justify-content-between align-items-center">
                      <h2 className="content-header-title content-header-title-small">
                        در انتظار پرداخت
                      </h2>
                      <section className="content-header-link"></section>
                    </section>
                  </section>

                  <section className="order-wrapper">
                    {orders.map((order) => {
                      return (
                        <section
                          key={order._id}
                          className="order-item border-bottom py-3"
                        >
                          <section className="d-flex justify-content-between">
                            <section>
                              <section className="order-item-date">
                                <i className="fa fa-calendar-alt"></i>{" "}
                                {new Date(order.createdAt).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </section>
                              <section className="order-item-id">
                                <i className="fa fa-id-card-alt"></i>کد سفارش :
                                {order._id}
                              </section>
                              <section className="order-item-status">
                                <i className="fa fa-clock"></i> {order.status}
                              </section>
                              <section className="order-item-products">
                                {order.items.map((item, index) => {
                                  return (
                                    <section key={index}>
                                      <Image
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        width={50}
                                        height={50}
                                      />
                                      <h3>{item.product.name}</h3>
                                    </section>
                                  );
                                })}
                              </section>
                            </section>
                            <section>
                              <section className="order-item-total">
                                <span>مبلغ کل :</span>
                                <span>{order.totalPrice} تومان</span>
                              </section>
                              <section className="order-item-total">
                                <span>مبلغ تخفیف :</span>
                                <span>{order.discountPrice} تومان</span>
                              </section>
                              <section className="order-item-total">
                                <span>مبلغ نهایی :</span>
                                <span>{order.finalPrice} تومان</span>
                              </section>
                            </section>
                          </section>
                        </section>
                      );
                    })}
                  </section>
                </section>
              )}
            </section>
          </main>
        </section>
      </section>
    </section>
  );
};

export default MyOrder;

