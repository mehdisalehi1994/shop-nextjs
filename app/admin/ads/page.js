"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import GeneralError from "@/app/components/ui/GeneralError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import AuthWrapper from "@/app/components/auth/auth";

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ads");
        if (!response.ok) throw new Error("در دریافت تبلیغات مشکلی پیش آمده!");
        const data = await response.json();
        setAds(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "مشکلی در حذف پیش آمده است");
      // حذف از state برای آپدیت جدول بدون رفرش
      setAds(prev => prev.filter(ad => ad._id !== id));
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
              <h3 className="my-4">به صفحه مدیریت تبلیغات خوش آمدید</h3>

              {!loading && error && <GeneralError error={error} />}

              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Link href="ads/add" className="btn-custom-add mb-3 px-2 py-1 rounded">
                    <AiOutlinePlus />
                    افزودن
                  </Link>

                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>شناسه</th>
                        <th>عکس</th>
                        <th>لینک تبلیغات</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ads.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center">تبلیغی یافت نشد</td>
                        </tr>
                      ) : (
                        ads.map((ad, index) => (
                          <tr key={ad._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {/* عکس با لینک به صفحه تبلیغات که بعدها می‌توانیم در سایت استفاده کنیم */}
                              <Link href={`/ads/${ad._id}`} className="d-inline-block" >
                                <img
                                  className="img-fluid"
                                  src={ad.imageUrl}
                                  alt={`ad-${index}`}
                                  style={{ maxWidth: "150px", cursor: "pointer" }}
                                />
                              </Link>
                            </td>
                            <td>
                              {/* نمایش لینک؛ اینجا فقط متن لینک نشان داده می‌شود */}
                              <a href={ad.link} target="_blank" rel="noreferrer" style={{ cursor: "pointer" }}>
                                {ad.link}
                              </a>
                            </td>
                            <td>
                              <div className="btn-group-inline">
                                <Link href={`/admin/ads/${ad._id}`} className="btn-custom-edit" title="ویرایش">
                                  <AiOutlineEdit />
                                </Link>
                                <button
                                  onClick={() => {
                                    if (confirm("آیا مطمئن به حذف این تبلیغ هستید؟")) {
                                      handleDelete(ad._id);
                                    }
                                  }}
                                  className="btn-custom-delete"
                                  title="حذف"
                                >
                                  <AiOutlineDelete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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

export default Ads;
