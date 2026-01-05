"use client";
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Sidebar from '../components/ui/Sidebar';
import Header from '../components/ui/Header';
import AuthWrapper from '../components/auth/auth';
import LogoutButton from '../components/auth/LogoutButton';

const AdminDashboard = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <AuthWrapper>
      <Container fluid>
        <Row>
          <Col md={2} className='vh-100'>
            <Sidebar />
          </Col>

          <Col md={10}>
            <Header />

            <main className='content p-4'>
              <h4>به پنل ادمین خوش آمدید</h4>
              <p>در این بخش میتوانید موارد مختلف فروشگاه را مدیریت کنید.</p>
              
            </main>

            {/* توضیحات پروژه */}
              <div className="mt-4 text-secondary">
                <h5 className="fw-bold mb-3 text-dark">توضیحات پروژه</h5>

                {/* پاراگراف اول (همیشه نمایش داده می‌شود) */}
                <p>
                  پروژه نهایی: فروشگاه Amazon Iranian
                  <br />
                  فناوری‌ها و معماری
                  <br /><br />
                  فرانت‌اند: React و Next.js
                  <br /><br />
                  Next.js برای مدیریت صفحات و مسیرها (Routing) و سرور ساید
                  رندرینگ (SSR)
                  <br /><br />
                  بهره‌گیری از React برای طراحی کامپوننت‌های پویا و تعاملات
                  پیچیده UI
                  <br /><br />
                  تمامی صفحات کاملاً تعامل‌پذیر و ماژولار طراحی شده‌اند
                </p>

                {/* ادامه متن */}
                {showMore && (
                  <p>
                    بک‌اند: Next.js API Routes
                    <br /><br />
                    مدیریت عملیات CRUD، احراز هویت و مدیریت دیتاها
                    <br /><br />
                    اتصال مستقیم به MongoDB برای ذخیره‌سازی محصولات،
                    دسته‌بندی‌ها، کاربران، سفارشات و نظرات
                    <br /><br />
                    امنیت و احراز هویت:
                    <br /><br />
                    استفاده از پنل پیامکی ملی برای OTP و احراز هویت کاربران
                    <br /><br />
                    تمامی عملیات ثبت‌نام و ورود با OTP یک‌بار مصرف و
                    استانداردهای امنیتی انجام می‌شود
                    <br /><br />
                    مدیریت نقش‌ها (ادمین و کاربران عادی) به صورت کاملاً قابل
                    کنترل
                    <br /><br />
                    ویژگی‌های فنی قابل توجه:
                    <br /><br />
                    تمامی داده‌ها از MongoDB گرفته شده و ارتباط بین
                    دسته‌بندی‌ها، محصولات، برندها و سفارشات به صورت
                    ریلیشنال داخلی برقرار شده
                    <br /><br />
                    طراحی پنل ادمین کاملاً ماژولار برای مدیریت محصولات،
                    دسته‌بندی‌ها، تخفیف‌ها، کاربران، نظرات و تبلیغات
                    <br /><br />
                    پیاده‌سازی ریسپانسیو حرفه‌ای برای صفحات اصلی، داخلی
                    محصول، سبد خرید و تکمیل سفارش
                    <br /><br />
                    استفاده از جاوااسکریپت برای تعاملات پویا: اسلایدرها،
                    منوهای کشویی، دکمه‌های افزودن/حذف، مشاهده همه محصولات،
                    فرم دیدگاه، OTP و مدیریت تخفیف‌ها
                    <br /><br />
                    بخش پنل ادمین
                    <br /><br />
                    داشبورد: خوش‌آمدگویی به ادمین و نمای کلی از وضعیت سایت
                    <br /><br />
                    مدیریت دسته‌بندی‌ها: مشاهده لیست، افزودن، ویرایش و حذف
                    <br /><br />
                    مدیریت محصولات، تخفیف‌ها، کاربران، نظرات، تبلیغات و
                    موجودی
                    <br /><br />
                    بخش فروشگاه اصلی سایت، صفحات محصول، سبد خرید، ثبت
                    سفارش، لیست سفارشات
                    <br /><br />
                    دلایل استفاده از React و Next.js، امنیت بالا، SSR،
                    توسعه‌پذیری و عملکرد استاندارد
                    <br /><br />
                    احراز هویت امن با OTP و مدیریت کامل نقش‌ها
                  </p>
                )}

                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'بستن' : 'بیشتر'}
                </button>
              </div>
          </Col>
        </Row>
      </Container>
    </AuthWrapper>
  );
};

export default AdminDashboard;
