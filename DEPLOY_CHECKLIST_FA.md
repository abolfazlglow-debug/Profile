# چک‌لیست انتشار AXVORQ

## مهم‌ترین اصلاح نسبت به انتشار قبلی
این ZIP شامل ساختار کامل پروژه است. در GitHub باید **محتویات پوشه `axvorq_seo_v2`** در ریشه مخزن قرار بگیرند؛ خود پوشه را به‌عنوان یک پوشه تو‌در‌تو منتشر نکنید.

## پس از انتشار، این URLها را جداگانه باز کنید
- `https://www.axvorq.ir/assets/css/styles.min.css`
- `https://www.axvorq.ir/assets/js/main.js`
- `https://www.axvorq.ir/assets/js/data.js`
- `https://www.axvorq.ir/assets/js/supabase-config.js`
- `https://www.axvorq.ir/assets/js/google-sheets-config.js`
- `https://www.axvorq.ir/assets/images/axvorq-mark.webp`
- `https://www.axvorq.ir/partials/header.html`

همه باید پاسخ موفق (200) بدهند؛ اگر یکی 404 بود، مسیر/نام فایل یا محل انتشار اشتباه است.

## ورود با Google
1. Supabase → Authentication → Providers → Google: فعال و دارای Client ID/Secret.
2. Google Cloud: Authorized redirect URI باید callback ارائه‌شده توسط Supabase باشد، نه dashboard سایت.
3. Supabase → Authentication → URL Configuration: Site URL دامنه اصلی و Redirect URLs شامل `https://www.axvorq.ir/**` و مسیرهای مورد استفاده باشد.
4. صفحه `auth.html` → دکمه Google.
5. بعد از ورود، باید به `dashboard.html` بازگردد.

## تست‌های ضروری
- صفحه خانه و `join.html` با CSS و لوگو
- منوی موبایل و تغییر زبان
- فرم تماس/عضویت و تأیید ثبت واقعی در Sheet
- ایمیل/رمز، ساخت حساب، بازیابی رمز
- Google OAuth و بازگشت به داشبورد
- دسترسی پنل مدیر و کارشناس با حساب‌های مناسب

تست‌های خارجی به دلیل محدودیت اتصال در این محیط انجام نشده‌اند.
