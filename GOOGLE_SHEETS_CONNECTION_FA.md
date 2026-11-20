# اتصال AXVORQ به Google Sheets

Web App URL فعلی در `assets/js/google-sheets-config.js` ثبت شده است.

## دریافت عمومی
- `?action=health`
- `?action=articles`
- `?action=experts`
- `?action=projects`
- `?action=categories`
- `?action=settings`

## ثبت فرم
فرم‌ها با یک iframe مخفی ارسال می‌شوند و پاسخ `postMessage` دارای nonce را بررسی می‌کنند. در صورت پاسخ موفق Apps Script، پیام «ثبت در Google Sheets تأیید شد» نمایش داده می‌شود؛ در صورت timeout یا پاسخ ناموفق، پیام خطا/عدم‌تأیید نمایش داده می‌شود.

## Sheets headers
شیت `Submissions` باید header row داشته باشد. نام ستون‌ها: `submission_id`, `submission_type`, `name`, `email`, `role_or_category`, `portfolio_url`, `message`, `status`, `assigned_to`, `created_at`, `updated_at`, `internal_note`. ستون‌ها با نام خوانده می‌شوند، پس ترتیب مهم نیست.

## تست واقعی
پس از Deploy به‌عنوان Web App، از فرم تماس یک پیام تست با ایمیل کنترل‌شده ارسال کن و ردیف را در Spreadsheet تأیید کن. endpoint عمومی است؛ فقط اطلاعات عمومی و فرم‌های ورودی را دریافت می‌کند و نباید برای عملیات مدیریتی یا داده‌های خصوصی استفاده شود. محدودیت ارسال per-email در کد وجود دارد.
