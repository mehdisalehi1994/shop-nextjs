"use client";
import AuthWrapper from "@/app/components/auth/auth";
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

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [categorize, setCategorize] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const productResponse = await fetch(`/api/products/${id}`);
        if (!productResponse.ok) throw new Error("خطا در دریافت محصول");
        const productData = await productResponse.json();

        setName(productData.name ?? "");
        setDescription(productData.description ?? "");
        setPrice(productData.price ?? "");
        setStock(productData.stock ?? "");
        setCategory(productData.category?._id ?? "");
        setCurrentImage(productData.imageUrl ?? "");

        const categorizeResponse = await fetch("/api/categorize");
        const categorizeData = await categorizeResponse.json();
        setCategorize(categorizeData);
      } catch (error) {
        setError("مشکلی در دریافت محصول پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین 3 تا 30 باشد");
      return false;
    }

    if (!description || description.trim() === "") {
      setFormError("توضیحات محصول الزامی میباشد");
      return false;
    } else if (description.length < 10 || description.length > 500) {
      setFormError("توضیحات محصول باید بین 10 تا 500 کارکتر باشد");
      return false;
    }

    const priceNum = Number(price);
    const stockNum = Number(stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("قیمت محصول باید یک مقدار مثبت معتبر باشد");
      return false;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setFormError("موجودی محصول باید عددی و بزرگتر یا مساوی ۰ باشد");
      return false;
    }

    if (!category) {
      setFormError("انتخاب دسته بندی الزامی میباشد");
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      if (image) formData.append("image", image);

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setFormError(result.message || "خطا در بروزرسانی محصول");
        return;
      }

      router.push("/admin/products");
    } catch (error) {
      setError(error.message);
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
            <h3 className="my-4">ویرایش محصول</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <FormLabel>نام محصول </FormLabel>
                <FormControl
                  type="text"
                  placeholder="نام محصول ..."
                  value={name ?? ""}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>

              <br />
              <FormGroup className="mb-3">
                <FormLabel>توضیحات</FormLabel>
                <FormControl
                  type="text"
                  placeholder="توضیحات..."
                  value={description ?? ""}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormGroup>

              <br />
              <FormGroup className="mb-3">
  <FormLabel>تصویر</FormLabel>
  <div className="mb-2">
    {currentImage && !image && (  // اگر تصویر جدید انتخاب نشده بود، تصویر قبلی را نمایش بده
      <img
        src={currentImage}
        alt="تصویر فعلی محصول"
        style={{ maxWidth: "200px", maxHeight: "200px", display: "block", marginBottom: "10px" }}
      />
    )}
  </div>
  <FormControl
    type="file"
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
  />
</FormGroup>


              <br />
              <FormGroup className="mb-3">
                <FormLabel>قیمت</FormLabel>
                <FormControl
                  type="number"
                  placeholder="30000"
                  value={price ?? ""}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ direction: "rtl", textAlign: "right" }}
                />
              </FormGroup>

              <br />
              <FormGroup className="mb-3">
                <FormLabel>موجودی</FormLabel>
                <FormControl
                  type="number"
                  placeholder="10"
                  value={stock ?? ""}
                  onChange={(e) => setStock(e.target.value)}
                  style={{ direction: "rtl", textAlign: "right" }}
                />
              </FormGroup>

              <br />
              <FormGroup className="mb-3">
                <FormLabel>نوع دسته بندی</FormLabel>
                <Form.Select
                  value={category ?? ""}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">انتخاب دسته بندی</option>
                  {categorize.map((cat) => {
                    return (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </Form.Select>
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

export default UpdateProduct;
