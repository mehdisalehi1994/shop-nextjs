"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";

const UpdateAd = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null); // فایل جدید
  const [currentImage, setCurrentImage] = useState(""); // مسیر تصویر فعلی برای نمایش
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ads/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت تبلیغ");
        const data = await res.json();
        setLink(data.link ?? "");
        setCurrentImage(data.imageUrl ?? "");
      } catch (err) {
        setError("مشکلی در دریافت تبلیغ پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  const validateForm = () => {
    if (!link || link.trim() === "") {
      setFormError("لینک تبلیغات الزامی میباشد");
      return false;
    }
    try {
      new URL(link);
    } catch {
      setFormError("لینک معتبر نمیباشد");
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
      formData.append("link", link);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/ads/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setFormError(result.message || "خطا در بروزرسانی تبلیغ");
        return;
      }

      alert("تغییرات با موفقیت انجام شد");
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
              <h3 className="my-4">ویرایش تبلیغات</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              {formError && <Alert variant="warning">{formError}</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <FormLabel>عکس</FormLabel>
                  <div className="mb-2">
                    {currentImage && !image && (
                      <img
                        src={currentImage}
                        alt="current-ad"
                        style={{ maxWidth: "200px", maxHeight: "200px", display: "block", marginBottom: "10px" }}
                      />
                    )}
                  </div>
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

                <Button type="submit">ذخیره تغییرات</Button>
              </Form>
            </main>
          </Col>
        </Row>
      </Container>
    </AuthWrapper>
  );
};

export default UpdateAd;
