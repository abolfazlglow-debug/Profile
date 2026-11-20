# گزارش ساخت و بررسی AXVORQ — نسخه QA

**وضعیت:** بستهٔ کد ساخته و بررسی‌های ایستا انجام شد؛ انتشار نهایی هنوز تأیید نشده است.

## ۱) تغییرات انجام‌شده

- اصلاح `src`/`href` اسکریپت‌ها در صفحات HTML که به‌علت `\"` عملاً نامعتبر بودند.
- حذف URL لوگوی دارای `[USERNAME]` و `[REPO]` که تصویر شکسته ایجاد می‌کرد.
- ایجاد نشان موقت AX محلی در SVG، WebP، PNG و ICO تا زمانی که منبع دقیق لوگوی رسمی جایگزین شود.
- طراحی Light Mode با پالت سفید، سیاه، خاکستری و آبی آسمانی/فیروزه‌ای؛ رنگ‌های CSS بررسی‌شده به این پالت محدود شدند.
- ساخت و فشرده‌سازی فایل CSS یکپارچه؛ حجم فایل `styles.min.css` حدود 19.2 KB است.
- افزودن favicon، preload نشان، alt text و متادیتای OG/Twitter.
- canonical و hreflang فارسی/x-default برای صفحات؛ hreflang انگلیسی جداگانه اضافه نشد چون نسخه انگلیسی URL مستقل ندارد.
- Sitemap و robots بازبینی و sitemap از نظر XML معتبر شد.
- افزودن Breadcrumb UI و BreadcrumbList؛ Article و Person schema در صفحات جزئیات به‌صورت پویا.
- شمارنده‌های صفحه اصلی از داده‌های واقعی بارگذاری‌شده تغذیه می‌شوند؛ آمار نمونهٔ ثابت حذف شد.
- افزودن بازیابی رمز عبور و حالت تعیین رمز جدید.
- تکمیل ساختار SQL برای مقالات و کارشناسان Supabase، سیاست‌های RLS، RPC تغییر نقش و محدودیت تغییر نقش مدیر.
- بازنویسی پنل مدیریت: جست‌وجو و فیلتر، تغییر/حذف درخواست‌ها و پروژه‌ها، مدیریت نقش کاربران، CRUD کارشناسان و مقالات، خروجی CSV گزارش‌ها.
- فرم افزودن کارشناس امکان لینک حساب Supabase و ذخیره permission flags دارد. **permission flags در این نسخه metadata هستند و به‌تنهایی مجوز امنیتی مستقل ایجاد نمی‌کنند؛ امنیت واقعی با role و RLS اعمال می‌شود.**
- اتصال فرم Google Sheets از `no-cors` به ارسال iframe و پاسخ `postMessage` دارای nonce تغییر کرد تا UI فقط در صورت دریافت پاسخ موفق Apps Script پیام تأیید بدهد.
- جلوگیری از Formula Injection در داده‌های ارسالی به Google Sheets.

## ۲) تست‌های واقعی اجراشده در این محیط

| تست | نتیجه | شواهد |
|---|---|---|
| تعداد صفحات HTML | PASS | 13 صفحه |
| H1 | PASS | هر 13 صفحه دقیقاً یک H1 دارند؛ صفحات جزئیات placeholder H1 دارند و پس از بارگذاری جایگزین می‌شود |
| Canonical | PASS | هر 13 صفحه دقیقاً یک canonical دارند |
| ارجاع‌های محلی | PASS | 251 ارجاع بررسی؛ فایل مقصد محلی ناموجود پیدا نشد |
| تصاویر و alt | PASS | تصاویر HTML دارای alt هستند |
| Placeholder URL | PASS | `[USERNAME]` و `[REPO]` در صفحات حذف شدند |
| JavaScript syntax | PASS | 20 فایل JS با `node --check` |
| Google Apps Script syntax | PASS | `Code.gs` با بررسی Syntax جاوااسکریپت |
| CSS palette | PASS | رنگ‌های bundle با پالت تعیین‌شده تطبیق داده شد |
| CSS bundle | PASS | bundle تولید شد؛ حدود 19.2 KB |
| Sitemap XML | PASS | XML parser بدون خطا |
| HTTP smoke test | PASS | 13 صفحه و فایل‌های اصلی از سرور محلی HTTP کد 200 دادند |
| Browser interaction | BLOCKED | Playwright با `ERR_BLOCKED_BY_ADMINISTRATOR` نتوانست localhost را باز کند |
| شبکه خارجی | BLOCKED | DNS در محیط اجرای ما در دسترس نبود؛ دامنه سایت، Apps Script و Supabase قابل اتصال نبودند |

## ۳) امتیاز ارزیابی هر بخش

این امتیازها **ارزیابی داخلی کد و وضعیت تست** هستند، نه خروجی Lighthouse و نه تضمین انتشار.

| بخش | امتیاز | وضعیت |
|---|---:|---|
| ساختار صفحات و ارجاعات محلی | 100/100 | تأیید ایستا |
| Syntax جاوااسکریپت | 100/100 | تأیید ایستا |
| پالت طراحی | 100/100 | تأیید ایستا |
| SEO پایه (meta/canonical/sitemap/schema) | 92/100 | بخشی نیازمند تست زنده |
| لوگو | 60/100 | نشان موقت؛ منبع رسمی دقیق جایگزین نشده |
| فرم‌ها | 80/100 | کد و اعتبارسنجی بررسی؛ ارسال واقعی آزمایش نشده |
| Google Sheets | 65/100 | پل ارسال/تأیید کد شده؛ Deployment و درج واقعی تست نشده |
| Auth و بازیابی رمز | 75/100 | کد بررسی؛ حساب واقعی و OAuth تست نشده |
| RBAC و RLS | 85/100 | SQL آماده؛ migration در Supabase اجرا و تست نشده |
| پنل مدیریت | 88/100 | قابلیت‌ها در کد پیاده‌سازی؛ runtime با حساب مدیر تست نشده |
| Accessibility | 78/100 | H1/alt/label/aria بررسی؛ audit کامل کنتراست و keyboard نشده |
| Responsive | 80/100 | CSS موجود و اصلاح؛ تست مرورگر واقعی مسدود شد |
| Performance | 78/100 | CSS bundle و تصاویر بررسی؛ Lighthouse/PSI اندازه‌گیری نشده |
| Deployment/Domain | 45/100 | DNS و دامنه از محیط ما قابل تأیید نبود |

**میانگین ارزیابی داخلی: 80/100.** این میانگین به معنی Launch Ready نیست؛ تست‌های بیرونی هنوز شرط انتشار هستند.

## ۴) تست‌هایی که هنوز باید روی سرویس واقعی PASS شوند

### Google Sheets
- Deploy نسخه جدید `Code.gs` به‌عنوان Web App.
- بررسی endpoint health.
- ارسال تست تماس، عضویت و پروژه.
- تأیید وجود ردیف واقعی در `Submissions`.
- آزمایش honeypot و rate limit.

### Supabase/Auth
- اجرای `supabase-setup.sql`.
- ایجاد حساب مالک و ارتقای دستی آن به `super_admin` طبق دستور README.
- تأیید ایمیل، ورود، خروج، بازیابی رمز و تعیین رمز جدید.
- تنظیم Redirect URLs و Google OAuth در صورت استفاده.
- آزمایش RLS با guest/member/expert/admin/super_admin.
- تأیید عملیات CRUD در پنل و رد دسترسی غیرمدیر.

### Admin
- افزودن کارشناس بدون حساب و با حساب مرتبط.
- بررسی نقش expert و permission metadata.
- افزودن/ویرایش/انتشار/بایگانی مقاله.
- تغییر وضعیت و حذف درخواست/پروژه.
- تغییر نقش کاربران با RPC و تأیید محدودیت admin.
- دانلود و بازکردن CSV گزارش‌ها.

### SEO / Performance / Accessibility
- Lighthouse در Chrome روی دامنه production.
- PageSpeed Insights موبایل و دسکتاپ.
- بررسی Core Web Vitals واقعی (LCP، CLS، INP).
- Google Search Console: ثبت property و sitemap.
- Rich Results Test / Schema Validator.
- بررسی کنتراست، keyboard، screen reader و چند مرورگر.

## ۵) درباره امتیاز 100/100

Lighthouse سقف امتیاز **100** دارد؛ «بالاتر از 100» امتیاز استانداردی نیست. هدف باید 100/100 در هر بخش باشد، اما این امتیاز فقط پس از اجرای ابزار روی نسخه live قابل گزارش است. در این محیط Lighthouse و PageSpeed اجرا نشدند و عددی برای آن‌ها ساخته نشده است.

## ۶) مانع لوگوی رسمی

فایل ZIP ورودی منبع لوگو را نداشت و URL قبلی در کد placeholder بود. چون لینک raw GitHub یا آدرس repository/branch/path دقیق در گفتگو ارائه نشده، این build از نشان موقت AX استفاده می‌کند تا تصویر شکسته نماند. برای جایگزینی با **Futuristic Monochrome AX Monogram_compressed.webp** باید لینک مستقیم Raw یا لینک repository و مسیر فایل در اختیار باشد.

## ۷) نتیجه

این build برای بازبینی و deployment آزمایشی آماده است، اما **نسخه launch-ready با تست واقعی 100/100 نیست**. قبل از اعلام انتشار نهایی، تست‌های بخش ۴ باید انجام شوند و نشان رسمی نیز جایگزین نشان موقت شود.
