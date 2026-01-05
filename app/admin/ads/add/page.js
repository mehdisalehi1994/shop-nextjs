"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";

const AddAds = () => {
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    if (!image) {
      setFormError("انتخاب تصویر الزامی میباشد");
      return false;
    }
    if (!link || link.trim() === "") {
      setFormError("لینک تبلیغات الزامی میباشد");
      return false;
    }
    // ساده: بررسی فرمت لینک
    try {
      new URL(link);
    } catch {
      setFormError("لینک معتبر نمیباشد (مثال: https://example.com)");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("link", link);

      const response = await fetch("/api/ads", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.message || "مشکلی در ایجاد تبلیغ پیش آمده است");
        return;
      }

      // اعلان موفقیت و بازگشت به صفحه اصلی تبلیغات
      alert("تبلیغات با موفقیت ایجاد شد");
      router.push("/admin/ads");
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
              <h3 className="my-4">افزودن تبلیغات</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              {formError && <Alert variant="warning">{formError}</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <FormLabel>عکس</FormLabel>
                  <FormControl
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files && e.target.files[0])}
                  />
                </FormGroup>

                <br />

                <FormGroup className="mb-3">
                  <FormLabel>لینک</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </FormGroup>

                <Button type="submit">ذخیره</Button>
              </Form>
            </main>
          </Col>
        </Row>
      </Container>
    </AuthWrapper>
  );
};

export default AddAds;
