"use client";
import { redirect } from "next/dist/server/api-utils";
import { signIn } from "next-auth/react"
import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import NoAuthWrapper from "@/app/components/auth/NoAuth";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

  

    const phoneRegex = /^(\+90|0)?9\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setError("شماره تلفن وارد شده صحیح نیست");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        // 👈 اصلاح شد
        body: JSON.stringify({ phone, type: "login" }), 
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "خطایی سمت سرور رخ داده است");
      } else {
        setSuccess("کد تایید برای شما ارسال شد");
        setStep(2);
      }
    } catch (error) {
      setError("خطایی در اتصال یا پردازش داده رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      
      if(!otp || otp.length !== 6) {
        setError("کد تایید باید 6 رقمی باشد")
        return;
      } 
      setLoading(true);
       
      const result = await signIn("credentials", {
        phone,
        code: otp,
        redirect: false,
      });
      
      if(!result.ok){
        setError(result.error || "خطایی رخ داده است.");
      }
       else{
        setSuccess("ورود با موفقیت انجام شد");
       }
      
      
      setLoading(false);

      if (result?.error) {
    setError(result.error); // ← مهم‌ترین قسمت!
    return;
  }

  // اگر لاگین موفق بود:
  window.location.href = "/admin"; // یا هر صفحه‌ای که باید برود
      
  };

  return (
    <NoAuthWrapper>
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100 d-flex justify-content-center align-items-center">
          <Col md={6} lg={4}>
            <Card
              className="shadow py-5"
              style={{ borderRadius: "10px", border: "none" }}
            >
              <CardBody>
                <h2
                  className="text-center mb-4 fw-bolder"
                  style={{ color: "#212529" }}
                >ورود به سیستم
                </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                {step === 1 && (
                  <Form onSubmit={handleSendOtp}>
                    <FormGroup>
                      <FormLabel className="mt-3">شماره تلفن</FormLabel>
                      <FormControl
                        type="text"
                        placeholder="شماره تلفن خود را وارد نمایید"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </FormGroup>
                    <Button
                      type="submit"
                      className="w-100 mt-3"
                      disabled={loading}
                    >
                      {loading ? "در حال ارسال ..." : "ورود"}
                    </Button>
                  </Form>
                )}
                {step === 2 && (
                  <Form onSubmit={handleLogin}>
                    <FormGroup>
                      <FormLabel>کد تایید</FormLabel>
                      <FormControl
                        type="text"
                        placeholder="کد تایید را وارد نمایید"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </FormGroup>
                    <Button
                      type="submit"
                      className="w-100 mt-3"
                      disabled={loading}
                    >
                      {loading ? "در حال تاییدیه ..." : "تایید کد"}
                    </Button>
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </NoAuthWrapper>
  );
};

export default Login;