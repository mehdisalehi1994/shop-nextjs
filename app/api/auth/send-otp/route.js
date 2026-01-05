import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import crypto from "crypto";
// 👈 نیاز به User هم دارید اگر از آن در خطوط پایین‌تر استفاده می‌کنید
import Users from "@/models/Users";
import { sendSms } from "@/app/lib/melipayamak";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToDatabase(); // 👈 اصلاحیه اصلی: تعریف متغیرها با 'let' در حوزه بیرونی
  let phone, name, type;
  try {
    // 👈 حذف 'const' برای اینکه متغیرهای بیرونی مقدار بگیرند
    ({ phone, name, type } = await request.json());
    if (!type || !["register", "login"].includes(type)) {
      return new Response(
        JSON.stringify({
          message: "نوع درخواست نامعتبر است",
        }),
        {
          status: 400,
        }
      );
    }
  } catch (jsonError) {
    // اگر خواندن JSON شکست بخورد (مثلا بدنه خالی باشد)
    return new Response(
      JSON.stringify({ message: "فرمت درخواست نامعتبر است." }),
      { status: 400 }
    );
  }

  // 👈 اضافه کردن بلاک try...catch برای مدیریت خطاهای Mongoose و سایر خطاها
  try {
    // 👈 حالا phone در دسترس است
    const phoneRegex = /^09\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({
          message: "شماره تلفن وارد شده صحیح نیست",
        }),
        { status: 400 }
      );
    }

    if (type === "register") {
      if (!name || name.trim().length < 3 || name.trim().length > 30) {
        return new Response(
          JSON.stringify({
            message: "نام و نام خانوادگی باید بین 3 تا 30 کارکتر باشد",
          }),
          { status: 400 }
        );
      }

      // 👈 اگر مدل User را ایمپورت نکرده باشید، اینجا خطا می‌گیرید
      const existingUsers = await Users.findOne({ phone });
      if (existingUsers) {
        return new Response(
          JSON.stringify({
            message: "کاربری قبلا با این شماره تلفن ثبت نام کرده است",
          }),
          { status: 400 }
        );
      }
    } else if (type === "login") {
      const users = await Users.findOne({ phone });
      if (!users) {
        return new Response(
          JSON.stringify({
            message: "کاربری با این شماره ثبت نام نکرده است",
          }),
          { status: 400 }
        );
      }
    }
    const otpCode = crypto.randomInt(100000, 999999).toString(); 

    await Otp.create({
      phone,
      code: otpCode,
      kind: type === "register" ? 1 : 2,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }); // پاسخ موفقیت آمیز

    // send SMS otpCode to phone number
await sendSms(phone,`کد تایید شما: ${otpCode}`);

    return new Response(
      JSON.stringify({ message: "کد تایید برای شما ارسال شد" }),
      { status: 200 }
    ); // 👈 بقیه کدهای شما که در انتها بودند و هرگز اجرا نمی‌شدند، حذف شدند.
  } catch (error) {
    // 👈 بلاک catch جدید برای مدیریت خطاهای اصلی
    console.error("OTP API Error:", error);
    let errorMessage = "خطای ناشناخته سرور";
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((val) => val.message);
      errorMessage = errors.join(", ");
    } else if (error.code === 11000) {
      errorMessage =
        "یک درخواست OTP برای این شماره قبلاً ثبت شده است. لطفاً صبر کنید.";
    } else {
      errorMessage = error.message; // در صورت خطا در findOne یا create
    } // پاسخ خطا (تضمین بازگشت Response در بلاک catch)

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
