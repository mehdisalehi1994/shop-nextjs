"use client";
import AuthWrapper from '@/app/components/auth/auth';
import Header from '@/app/components/ui/Header';
import Sidebar from '@/app/components/ui/Sidebar';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Alert, Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';

const AddCategory = () => {

const [name, setName] = useState("");
const [error, setError] = useState(null);
const [formError, setFormError] = useState("");
const router = useRouter();

const validateForm = () => {
  if (name.trim() === "") {
    setFormError("نام دسته بندی الزامی میباشد");
    return false;
  }
  else if (name.length < 3 || name.length > 30) {
    setFormError("نام دسته بندی باید بین 3 تا 30 باشد");
    return(false);
  }
  setFormError("");
  return true;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    return;
  }
  try{
   const response = await fetch("/api/categorize", {
    method : "POST",
    headers : {"Content-Type" : "application/json"},
    body : JSON.stringify({name}),
   });
   if(response.status === 400)
        {
          setFormError(response.message);
        }
    if (!response.ok) throw new Error("مشکلی در ساخت دسته بندی پیش آمده است");
    router.push("/admin/categorize");
  }
  catch(error){
    setError(error.message);
  }
}

    return (
      <AuthWrapper>
        <Container fluid>
            <Row>
                <Col md={2} className='vh-100'>
                  <Sidebar  /> 
                </Col>
                <Col md={10}>
                  <Header  />
                  <main className='p-4'>
                    <h3 className='my-4'>افزودن دسته بندی جدید</h3>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {formError && <Alert variant='warning'>{formError}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      <FormGroup className='mb-3'>
                        <FormLabel>نام دسته بندی</FormLabel>
                        <FormControl  type='text' placeholder='نام دسته بندی...' value={name} onChange={(e) => setName(e.target.value)} />
                      </FormGroup>
                      <Button type='submit'>ذخیره</Button>
                    </Form>
                  </main>
                </Col>
            </Row>
        </Container>
        </AuthWrapper>
    );
};

export default AddCategory;