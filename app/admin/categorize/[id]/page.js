"use client";
import AuthWrapper from '@/app/components/auth/auth';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row
} from 'react-bootstrap';

const UpdateCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categorize/${id}`);
        if (!res.ok) {
          throw new Error("خطا در دریافت اطلاعات دسته‌بندی");
        }
        const data = await res.json();
        setName(data.name || "");
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  const validateForm = () => {
    if (name.trim() === "") {
      setFormError("نام دسته‌بندی الزامی می‌باشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`/api/categorize/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.message || "مشکلی در بروزرسانی پیش آمده است");
        return;
      }

      router.push("/admin/categorize");
    } catch (error) {
      setError("خطا در برقراری ارتباط با سرور");
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
            <h3 className="my-4">ویرایش دسته‌بندی</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <FormLabel>نام دسته‌بندی</FormLabel>
                <FormControl
                  type="text"
                  placeholder="نام دسته‌بندی..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

export default UpdateCategory;
