# گزارش اصلاح SEO — AXVORQ SEO v2

## خلاصه
این نسخه اصلاحات SEO داخل کد و فایل‌های ایستا را اعمال می‌کند. امتیاز زیر **ارزیابی دستی/ایستای کد** است و امتیاز Lighthouse یا نتیجه Google Search Console نیست.

**امتیاز بررسی ایستا: 88/100**

## اصلاحات اعمال‌شده
- عنوان و توضیحات متای صفحات عمومی بازنویسی و اختصاصی شد.
- Canonical صفحات عمومی ایستا یکدست شد.
- Hreflang صفحات عمومی به `fa-IR` و `x-default` تنظیم شد (هر دو به URL فارسی فعلی اشاره می‌کنند).
- Open Graph و Twitter Card اصلاح شدند و تصویر اشتراک‌گذاری 1200×630 اختصاصی `assets/images/og-axvorq.png` ساخته شد.
- ابعاد و نوع تصویر Open Graph اضافه شد.
- BreadcrumbList برای صفحات عمومی ایستا اضافه شد.
- Robots.txt اصلاح شد تا صفحات دارای noindex از دسترسی crawler مسدود نشوند.
- صفحات مدیریت، ورود و داشبوردها دارای `noindex, nofollow, noarchive` هستند و از hreflang حذف شدند.
- Sitemap به صفحات عمومی ایستای قابل ایندکس محدود شد و صفحات خصوصی و قالب‌های داینامیک در آن قرار نگرفتند.
- خطای ترتیب تعریف متغیر `canonical` در `assets/js/article.js` اصلاح شد؛ قبلاً Breadcrumb به متغیری ارجاع می‌داد که هنوز تعریف نشده بود و می‌توانست اجرای render را متوقف کند.
- در صفحه مقاله، canonical و OG/Twitter metadata به slug مقاله هنگام بارگذاری تنظیم می‌شوند.
- Article JSON-LD به اطلاعات محتوای بارگذاری‌شده مجهزتر شد؛ اطلاعات نویسنده/تاریخ ویرایش تنها در صورت وجود داده استفاده می‌شود.
- متادیتای پروفایل متخصص به‌صورت داینامیک تنظیم می‌شود.

## تست‌های ایستای انجام‌شده
- 13 صفحه HTML بررسی شد.
- همه صفحات دارای یک H1 در HTML اولیه بودند.
- Canonical در صفحات ایستای عمومی یک عدد است؛ قالب مقاله و متخصص برای Canonical داینامیک طراحی شده‌اند.
- 20 فایل JavaScript با `node --check` بررسی شدند: PASS.
- XML فایل Sitemap parse شد: PASS (7 URL).
- JSON-LD موجود در HTMLها parse شد: PASS.
- Robots.txt وجود دارد و Sitemap را معرفی می‌کند.
- تصویر OG تولید شد و در مسیر محلی قرار دارد.
- یک ارجاع `${cover}` در بررسی regex به‌عنوان لینک محلی گزارش شد؛ این عبارت داخل template literal کد تولید کارت مقاله است و لینک ثابت HTML نیست (false positive).

## مواردی که هنوز تأیید نشده‌اند
- تست آنلاین Lighthouse/PSI و Core Web Vitals واقعی.
- دسترسی Googlebot به سایت روی دامنه زنده و مشاهده نسخه render شده.
- ایندکس واقعی صفحات در Google Search Console.
- اعتبارسنجی خارجی Schema با Rich Results Test / Schema Validator.
- SEO مستقل مقاله‌ها و کارشناسان در URLهای query-string. برای SEO قوی‌تر پیشنهاد می‌شود به صفحات HTML/URLهای مستقل مبتنی بر slug یا prerender/SSR مهاجرت شود؛ JavaScript metadata به‌تنهایی تضمین ایندکس کامل نیست.
- تصویر OG باید بعد از انتشار از URL عمومی با HTTP 200 بررسی شود.

## Sitemap
Sitemap فعلی شامل صفحه اصلی، درباره، آرشیو مقاله‌ها، فهرست کارشناسان، پروژه‌ها، تماس و عضویت است. صفحات خصوصی و صفحات جزئیات داینامیک در آن نیستند.

## فایل‌های کلیدی
- `robots.txt`
- `sitemap.xml`
- `assets/images/og-axvorq.png`
- `assets/js/article.js`
- `assets/js/expert.js`
- متادیتای صفحات HTML

## راه‌اندازی پس از انتشار
1. ZIP را روی GitHub Pages/میزبانی منتشر کنید.
2. بررسی کنید `https://www.axvorq.ir/robots.txt` و `https://www.axvorq.ir/sitemap.xml` پاسخ 200 بدهند.
3. تصویر OG را از `https://www.axvorq.ir/assets/images/og-axvorq.png` باز کنید.
4. در Google Search Console، property دامنه را تأیید و Sitemap را submit کنید.
5. چند URL مهم را با URL Inspection بررسی و Request Indexing کنید.
6. Lighthouse و PageSpeed Insights را روی صفحه اصلی، مقالات، کارشناسان و پروژه‌ها اجرا کنید.

> این پکیج اصلاحات SEO ایستا را اعمال می‌کند، اما به‌دلیل عدم دسترسی به سایت زنده و سرویس‌های خارجی، «100/100» یا ایندکس تضمینی اعلام نمی‌شود.
