"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

const AddDiscount = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expiration, setExpiration] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  const validateForm = () => {
    if (!code.trim()) {
      setFormError("کد تخفیف الزامی است");
      return false;
    }
    if (!discountPercentage || isNaN(discountPercentage)) {
      setFormError("درصد تخفیف باید عدد باشد");
      return false;
    }
    const perc = Number(discountPercentage);
    if (perc < 5 || perc > 100) {
      setFormError("درصد تخفیف باید بین 5 تا 100 باشد");
      return false;
    }
    if (!expiration) {
      setFormError("تاریخ انقضا الزامی است");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dateObj = expiration.toDate();

      const body = {
        code: code.trim(),
        discountPercentage: Number(discountPercentage),
        expirationDate: dateObj,
        isActive, // 🔹 اضافه شد
      };

      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "خطا در ذخیره کد تخفیف");
        return;
      }

      router.push("/admin/discount");
    } catch (err) {
      setError(err.message || "خطا در ارتباط با سرور");
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
            <h3 className="my-4">افزودن کد تخفیف جدید</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <FormLabel>کد تخفیف</FormLabel>
                <FormControl
                  type="text"
                  placeholder="کد تخفیف وارد نمایید"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>درصد تخفیف</FormLabel>
                <FormControl
                  type="number"
                  placeholder="مثال: 20"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  min={5}
                  max={100}
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
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                  }}
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
                ذخیره کد تخفیف
              </Button>
            </Form>
          </main>
        </Col>
      </Row>
    </Container>
    </AuthWrapper>
  );
};

export default AddDiscount;
