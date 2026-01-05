"use client";
import NoAuthWrapper from "@/app/components/auth/NoAuth";
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

const Register = () => {
  const [name, setName] = useState("");
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

    if (!name || name.trim().length < 3 || name.trim().length > 30) {
      setError("نام و نام خانوادگی باید بین 3 تا 30 کارکتر باشد");
      return;
    }

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
        body: JSON.stringify({ name, phone, type: "register" }), 
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

  const handleVerifyOtp = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      if(!otp || otp.length !== 6) {
        setError("کد تایید باید 6 رقمی باشد")
        return;
      } 
      setLoading(true);
      try{
       const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "appliction/json",
        },
        body: JSON.stringify({phone, code: otp, name}),
       });

       const data = await res.json();
       if(!res.ok){
        setError(data.message || "خطایی سمت سرور رخ داده است");
       }
       else{
        setSuccess("شما با موفقیت ثبت نام شدید");
       }
      }
      catch(error){
        setError("خطایی رخ داده است");
      }
      finally{
       setLoading(false);
      }
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
                >
                  ثبت نام در سیستم
                </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                {step === 1 && (
                  <Form onSubmit={handleSendOtp}>
                    <FormGroup>
                      <FormLabel>نام و نام خانوادگی</FormLabel>
                      <FormControl
                        type="text"
                        placeholder="نام و نام خانوادگی وارد نمایید"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormGroup>
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
                      {loading ? "در حال ارسال ..." : "ثبت نام"}
                    </Button>
                  </Form>
                )}
                {step === 2 && (
                  <Form onSubmit={handleVerifyOtp}>
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

export default Register;