"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import GeneralError from "@/app/components/ui/GeneralError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import AuthWrapper from "@/app/components/auth/auth";

// تابع تبدیل میلادی به شمسی
function toPersianDate(dateStr) {
  const date = new Date(dateStr);
  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return persianDate;
}

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/discount");
        if (!res.ok) throw new Error("مشکل در دریافت تخفیف‌ها!");
        const data = await res.json();
        setDiscounts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/discount/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف");
      setDiscounts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthWrapper>
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100">
          <Sidebar />
        </Col>
        <Col md={10}>
          <Header />
          <main className="p-4">
            <h3 className="my-4">مدیریت تخفیف‌ها</h3>
            {!loading && error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Link
                  href="discount/add"
                  className="btn-discount-add mb-3 px-2 py-2 rounded"
                >
                  <AiOutlinePlus /> افزودن کد تخفیف جدید
                </Link>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>شناسه</th>
                      <th>کد تخفیف</th>
                      <th>درصد تخفیف</th>
                      <th>تاریخ انقضا</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((d, index) => (
                      <tr key={d._id}>
                        <td>{index + 1}</td>
                        <td>{d.code}</td>
                        <td>{d.discountPercentage}%</td>
                        <td>{toPersianDate(d.expirationDate)}</td>
                        {/* 🔹 اصلاح وضعیت فعال/غیرفعال */}
                        <td>{d.isActive ? "فعال" : "غیر فعال"}</td>
                        <td>
                          <div className="btn-group-inline">
                            <Link
                              href={`/admin/discount/${d._id}`}
                              className="btn-custom-edit"
                            >
                              <AiOutlineEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(d._id)}
                              className="btn-custom-delete"
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
    </AuthWrapper>
  );
};

export default Discount;
