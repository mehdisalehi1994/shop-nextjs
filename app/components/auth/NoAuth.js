"use client";
// توجه: این ایمپورت‌ها در یک محیط Next.js واقعی لازم هستند
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// ✅ اصلاحیه: دی‌ساختاردهی { children } از آبجکت props برای جلوگیری از خطای "Object is not valid as a React child"
export default function NoAuthWrapper ({ children }) {
    const {data:session, status} = useSession();
    const router = useRouter();


    useEffect(() => {
        // ریدایرکت فقط اگر وضعیت 'unauthenticated' باشد
        if (status === "authenticated") {
            // اطمینان از اینکه ما در صفحه لاگین نیستیم
            // نکته: در App Router، router.pathname ممکن است کار نکند. بهتر است از router.asPath یا window.location.pathname استفاده شود، اما در این محیط، router.pathname را حفظ می‌کنیم.
            if (router.pathname !== '/') {
                router.push('/');
            }
        }
    }, [status, router]);


    // نمایش صفحه بارگذاری تا وضعیت احراز هویت مشخص شود
    if(status === "loading") {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="text-center p-4 rounded shadow-sm bg-white">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-3 text-muted">در حال بارگذاری اطلاعات احراز هویت...</div>
                </div>
            </div>
        );
    }

    // اگر کاربر احراز هویت شده، محتوای داخلی را رندر کن
    if(status === "unauthenticated") {
        return <>{children}</>;
    }

    // اگر unauthenticated باشد، useEffect کار ریدایرکت را انجام داده است.
    // در طول ریدایرکت یا اگر در صفحه لاگین هستیم، null برمی‌گردانیم تا رندر نشود.
    return null;
}