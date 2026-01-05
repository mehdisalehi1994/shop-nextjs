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
  FormCheck,
} from "react-bootstrap";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import AuthWrapper from "@/app/components/auth/auth";

const UpdateUser = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userResponse = await fetch(`/api/users/${id}`);
        if (!userResponse.ok) throw new Error("خطا در دریافت کاربر");
        const userData = await userResponse.json();

        setName(userData.name ?? "");
        setPhone(userData.phone ?? "");
        setEmail(userData.email ?? "");
        setIsAdmin(userData.isAdmin ?? false);
      } catch (error) {
        setError("مشکلی در دریافت کاربر پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام کاربر الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام کاربر باید بین 3 تا 30 باشد");
      return false;
    }

    if (!phone || phone.trim() === "") {
      setFormError("شماره موبایل الزامی میباشد");
      return false;
    } else if (!/^\d{11}$/.test(phone.trim())) {
      setFormError("شماره موبایل باید ۱۱ رقم باشد.");
      return false;
    }

    if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setFormError("لطفاً یک آدرس ایمیل معتبر وارد نمایید.");
        return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, isAdmin }),
      });
      const result = await response.json();

      if (!response.ok) {
        setFormError(result.message || "خطا در بروزرسانی کاربر");
        return;
      }
      router.push("/admin/users");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <LoadingSpinner />;

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
            <h3 className="my-4">ویرایش کاربر</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <FormLabel>نام کاربر</FormLabel>
                <FormControl
                  type="text"
                  placeholder="نام کاربری را وارد کنید"
                  value={name ?? ""}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>شماره موبایل</FormLabel>
                <FormControl
                  type="text"
                  placeholder="شماره موبایل را وارد نمایید."
                  value={phone ?? ""}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ direction: "ltr", textAlign: "left" }}
                  maxLength={11}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>ایمیل (اختیاری)</FormLabel>
                <FormControl
                  type="email"
                  placeholder="ایمیل..."
                  value={email ?? ""}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ direction: "ltr", textAlign: "left" }}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <FormCheck
                  type="checkbox"
                  label="ادمین"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </FormGroup>

              <Button type="submit">ذخیره تغییرات</Button>
            </Form>
          </main>
        </Col>
      </Row>
    </Container>
    </AuthWrapper>
  );
};

export default UpdateUser;