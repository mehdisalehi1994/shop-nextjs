"use client";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  FormControl,
  Alert,
} from "react-bootstrap";
import GeneralError from "@/app/components/ui/GeneralError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import AuthWrapper from "@/app/components/auth/auth";

// کامپوننت محصول تکی برای مدیریت موجودی
const StockItem = ({ product, onUpdate, formError }) => {
  const [newStock, setNewStock] = useState(product.stock);
  const [isUpdating, setIsUpdating] = useState(false);

  // به‌روزرسانی موجودی وقتی prop محصول تغییر می‌کند (مثلاً بعد از واکشی اولیه)
  useEffect(() => {
    setNewStock(product.stock);
  }, [product.stock]);

  const handleSave = () => {
    if (isNaN(newStock) || newStock < 0) {
      alert("موجودی باید عددی و بزرگتر یا مساوی صفر باشد.");
      return;
    }
    setIsUpdating(true);
    onUpdate(product._id, Number(newStock)).finally(() => {
      setIsUpdating(false);
    });
  };

  return (
    <tr>
      {/* ستون 1: شناسه (Id) */}
      <td>{product._id}</td>
      {/* ستون 2: نام محصول */}
      <td>{product.name}</td>
      {/* ستون 3: موجودی (با فیلد ورودی) */}
      <td>
        <FormControl
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          min="0"
          style={{ width: "100px", display: "inline-block" }}
        />
      </td>
      {/* ستون 4: عملیات */}
      <td>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isUpdating || Number(newStock) === Number(product.stock)}
          size="sm"
        >
          {isUpdating ? "ذخیره..." : "ذخیره"}
        </Button>
      </td>
    </tr>
  );
};

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchProductsStock = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stock");
      if (!response.ok) {
        throw new Error("در دریافت موجودی محصولات مشکلی پیش آمده!");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsStock();
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/stock", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: newStock }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "خطا در به‌روزرسانی موجودی");
      }

      // به‌روزرسانی state محلی برای نمایش تغییرات در جدول
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, stock: newStock } : p))
      );
      
      setSuccessMessage("موجودی محصول با موفقیت به‌روزرسانی شد ✅");
      setTimeout(() => setSuccessMessage(null), 5000); 
      
      return true; // موفقیت
    } catch (error) {
      setError(error.message);
      return false; // شکست
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
            <h3 className="my-4">مدیریت انبار</h3>
            
            {/* پیغام موفقیت (مطابق با تصویر) */}
            {successMessage && <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>{successMessage}</Alert>}
            
            {!loading && error && <GeneralError error={error} />}
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>شناسه</th>
                    <th>نام محصول</th>
                    <th>موجودی</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <StockItem
                      key={product._id}
                      product={product}
                      onUpdate={handleUpdateStock}
                    />
                  ))}
                </tbody>
              </Table>
            )}
          </main>
        </Col>
      </Row>
    </Container>
    </AuthWrapper>
  );
};

export default StockManagement;