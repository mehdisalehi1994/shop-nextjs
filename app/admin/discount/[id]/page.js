"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import AuthWrapper from "@/app/components/auth/auth";

const EditDiscount = () => {
  const router = useRouter();
  const { id } = useParams();

  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expiration, setExpiration] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // دریافت داده از سرور
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const res = await fetch(`/api/discount/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "خطا در دریافت اطلاعات");

        setCode(data.code || "");
        setDiscountPercentage(data.discountPercentage || "");
        setExpiration(new Date(data.expirationDate));
        setIsActive(data.isActive ?? true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscount();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dateObj = expiration?.toDate?.() || expiration;

      const body = {
        code,
        discountPercentage: Number(discountPercentage),
        expirationDate: dateObj,
        isActive,
      };

      const res = await fetch(`/api/discount/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در بروزرسانی");

      alert("کد تخفیف با موفقیت بروزرسانی شد ✅");
      router.push("/admin/discount");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

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
            <h3 className="my-4">ویرایش کد تخفیف</h3>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <FormLabel>کد تخفیف</FormLabel>
                <FormControl
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>درصد تخفیف</FormLabel>
                <FormControl
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>تاریخ انقضا</FormLabel>
                <DatePicker
                  value={expiration}
                  onChange={setExpiration}
                  calendar={persian}
                  locale={persian_fa}
                  inputPlaceholder="تاریخ انقضا را انتخاب کنید"
                />
              </FormGroup>

              <FormGroup className="mb-3 d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <FormLabel className="mb-0">فعال</FormLabel>
              </FormGroup>

              <Button type="submit" variant="success">
                ذخیره تغییرات
              </Button>
            </Form>
          </main>
        </Col>
      </Row>
    </Container>
    </AuthWrapper>
  );
};

export default EditDiscount;
