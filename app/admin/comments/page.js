"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Alert, Button } from "react-bootstrap";
import GeneralError from "@/app/components/ui/GeneralError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AuthWrapper from "@/app/components/auth/auth";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/comments");
      if (!response.ok) {
        throw new Error("در دریافت نظرات مشکلی پیش آمده!");
      }
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "مشکلی در حذف نظر پیش آمده است");

      // حذف نظر از state
      setComments((prev) => prev.filter((comment) => comment._id !== id));
      setMessage("نظر با موفقیت حذف شد.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "مشکلی در به‌روزرسانی وضعیت پیش آمده است");

      // به‌روزرسانی state
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === id ? { ...comment, isApproved: newStatus } : comment
        )
      );

      setMessage(
        newStatus ? "نظر کاربر تایید شد ✅" : "نظر کاربر عدم تایید شد ❌"
      );
      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      setError(error.message);
    }
  };

  const formatDateToJalali = (isoDate) => {
    try {
      if (!isoDate) return "نامشخص";
      const date = new Date(isoDate);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch (e) {
      return "خطا در تاریخ";
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
            <h3 className="my-4">مدیریت نظرات کاربران</h3>
            {message && <Alert variant="success">{message}</Alert>}
            {!loading && error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>شناسه</th>
                    <th>نام کاربر</th>
                    <th>موبایل کاربر</th>
                    <th>نظر کاربر</th>
                    <th>محصول</th>
                    <th>وضعیت تایید</th>
                    <th>تاریخ ثبت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment, index) => {
                    const isApproved = comment.isApproved;
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {/* ستون 2: نام کاربر (ریلیشن) */}
                        <td>{comment.userId?.name || "کاربر حذف شده"}</td> 
                        {/* ستون 3: موبایل کاربر (ریلیشن) */}
                        <td>{comment.userId?.phone || "نامشخص"}</td> 
                        {/* ستون 4: نظر کاربر */}
                        <td>{comment.text}</td> 
                        {/* ستون 5: محصول (ریلیشن) */}
                        <td>{comment.productId?.name || "محصول حذف شده"}</td> 
                        {/* ستون 6: وضعیت تایید */}
                        <td>
                          <Button
                            variant={isApproved ? "success" : "danger"}
                            size="sm"
                            onClick={() =>
                              handleToggleApproval(comment._id, isApproved)
                            }
                          >
                            {isApproved ? (
                              <>
                                <FaCheckCircle className="ms-1" />
                                تایید شده
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="ms-1" />
                                تایید نشده
                              </>
                            )}
                          </Button>
                        </td>
                        {/* ستون 7: تاریخ ثبت (شمسی) */}
                        <td>{formatDateToJalali(comment.createdAt)}</td> 
                        {/* ستون 8: عملیات حذف */}
                        <td>
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="btn-custom-delete"
                          >
                            <AiOutlineDelete />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </main>
        </Col>
      </Row>
    </Container>
    </AuthWrapper>
  );
};

export default Comments;