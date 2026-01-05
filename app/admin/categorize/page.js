"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import React, { useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useState } from "react";
import GeneralError from "@/app/components/ui/GeneralError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import AuthWrapper from "@/app/components/auth/auth";

const Categorize = () => {
  const [categorize, setCategorize] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorize = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/categorize");
        if (!response.ok) {
          throw new Error("مشکل در دریافت دسته بندی ها!");
        }
        const data = await response.json();
        setCategorize(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorize();
  }, []);
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`/api/categorize/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "مشکلی در حذف پیش آمده است");

    // حذف دسته‌بندی از state تا جدول بدون رفرش آپدیت شود
    setCategorize(prev => prev.filter(category => category._id !== id));
  } catch (error) {
    setError(error.message);
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
            <h3 className="my-4">مدیریت دسته بندی ها</h3>
            {!loading && error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Link
                  href="categorize/add"
                  className="btn-custom-add mb-3 px-2 py-1 rounded"
                >
                  <AiOutlinePlus />
                  افزودن
                </Link>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>شناسه</th>
                      <th>نام</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorize.map((category, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{category.name}</td>
                          <td>
                            <div className="btn-group-inline">
                              <Link
                                href={`/admin/categorize/${category._id}`}
                                className="btn-custom-edit"
                              >
                                <AiOutlineEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(category._id)}
                                className="btn-custom-delete"
                              >
                                <AiOutlineDelete />
                              </button>
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

export default Categorize;
