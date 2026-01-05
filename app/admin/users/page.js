"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Alert, Button } from "react-bootstrap";
import GeneralError from "@/app/components/ui/GeneralError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { AiOutlinePlus } from "react-icons/ai";
import { FaPencilAlt, FaTrashAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import AuthWrapper from "@/app/components/auth/auth";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("در دریافت کاربران مشکلی پیش آمده!");
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "مشکلی در حذف پیش آمده است");

      // حذف کاربر از state تا جدول بدون رفرش آپدیت شود
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setMessage("کاربر با موفقیت حذف شد.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleToggleAdmin = async (user) => {
    const newStatus = !user.isAdmin;
    try {
        const res = await fetch(`/api/users/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isAdmin: newStatus }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "مشکلی در تغییر وضعیت پیش آمده است");

        // به‌روزرسانی state
        setUsers((prev) => 
            prev.map(u => u._id === user._id ? { ...u, isAdmin: newStatus } : u)
        );

        const statusText = newStatus ? "ادمین" : "کاربر عادی";
        setMessage(`وضعیت کاربر به ${statusText} تغییر یافت.`);
        setTimeout(() => setMessage(""), 3000);

    } catch (error) {
        setError(error.message);
    }
  }

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
            <h3 className="my-4">مدیریت کاربران</h3>
            {message && <Alert variant="success">{message}</Alert>}
            {!loading && error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Link
                  href="users/add"
                  className="btn btn-primary mb-3 px-2 py-1 rounded d-inline-flex align-items-center"
                >
                  <FaUser className="ms-2" />
                  افزودن کاربر جدید
                </Link>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>شناسه</th>
                      <th>نام کاربر</th>
                      <th>موبایل</th>
                      <th>ایمیل</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      const isCurrentUserAdmin = user.isAdmin;
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.phone}</td>
                          <td>{user.email || "---"}</td>
                          {/* ستون 5: وضعیت */}
                          <td>
                            <span
                              className={`badge ${
                                isCurrentUserAdmin ? "bg-success" : "bg-primary"
                              }`}
                            >
                              {isCurrentUserAdmin ? "ادمین" : "کاربر عادی"}
                            </span>
                          </td>
                          {/* ستون 6: عملیات */}
                          <td>
                            <div className="btn-group-inline">
                              {/* دکمه طلایی: تغییر ادمین/کاربر عادی */}
                              <Button
                                variant="warning"
                                size="sm"
                                className="ms-1"
                                onClick={() => handleToggleAdmin(user)}
                              >
                                {isCurrentUserAdmin ? "تبدیل به کاربر عادی" : "تبدیل به ادمین"}
                              </Button>

                              {/* دکمه آبی: ویرایش */}
                              <Link
                                href={`/admin/users/${user._id}`}
                                className="btn btn-primary btn-sm ms-1"
                              >
                                <FaPencilAlt className="ms-1" />
                                ویرایش
                              </Link>

                              {/* دکمه قرمز: حذف */}
                              <Button
                                onClick={() => handleDelete(user._id)}
                                variant="danger"
                                size="sm"
                              >
                                <FaTrashAlt className="ms-1" />
                                حذف
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default Users;