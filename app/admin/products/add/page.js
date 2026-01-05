"use client";
import AuthWrapper from "@/app/components/auth/auth";
import Header from "@/app/components/ui/Header";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter } from "next/navigation";
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

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [categorize, setCategorize] = useState([]);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categorize");
      if (!res.ok) throw new Error("خطا در دریافت دسته بندی‌ها از سرور");

      const data = await res.json();
      setCategorize(data);
      setError(null); // چون موفق شدیم، خطا رو خالی کن
    } catch (err) {
      console.error("fetch categories error:", err);
      setError("مشکلی در دریافت دسته بندی ها رخ داده است");
    }
  };

  fetchCategories();
}, []);


  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین 3 تا 30 باشد");
      return false;
    }

   if (!description || description.trim() === "") {
      setFormError("توضیحات  محصول الزامی میباشد");
      return false;
    } else if (description.length < 10 || description.length > 500) {
      setFormError("توضیحات محصول باید بین 10 تا 500 کارکتر باشد");
      return false;
    }

    if (price <= 0) {
    setFormError("قیمت محصول باید یک مقدار مثبت باشد");
    return false;
  }


  if (stock < 0) {
    setFormError("موجودی محصول باید بزرگتر از 0 باشد");
    return false;
  }
  

   if (!category < 0) {
    setFormError("انتخاب دسته بندی الزامی میباشد");
    return false;
  }


   if (!image < 0) {
    setFormError("انتخاب تصویر الزامی میباشد");
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
       formData.append("image", image);

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      if (response.status === 400) {
        setFormError(response.message);
      }
      if (!response.ok) throw new Error("مشکلی در ساخت محصول پیش آمده است");
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
            <h3 className="my-4">افزودن محصول جدید</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <FormLabel>نام محصول جدید</FormLabel>
                <FormControl
                  type="text"
                  placeholder="نام محصول ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>
              <br />
              <FormGroup className="mb-3">
                <FormLabel>توضیحات</FormLabel>
                <FormControl
                  type="text"
                  placeholder="توضیحات..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormGroup>

              <br />
              <FormGroup className="mb-3">
                <FormLabel>تصویر</FormLabel>
                <FormControl
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </FormGroup>

              <br />
              <FormGroup className="mb-3">
                <FormLabel>قیمت</FormLabel>
                <FormControl
                  type="number"
                  placeholder="30000"
                  value={price}
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
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  style={{ direction: "rtl", textAlign: "right" }}
                />
              </FormGroup>

              <br />
              <FormGroup className="mb-3">
                <FormLabel>دسته بندی</FormLabel>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">انتخاب دسته بندی</option>
                  {categorize.map(cat => {
                    return (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
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

export default AddProduct;
