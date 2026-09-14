# OpsBoard — داشبورد شبیه Kibana با Next.js

یک اسکلت (scaffold) فرانت‌اند ماژولار با Next.js (App Router) که ظاهر و چیدمانش از Kibana الهام گرفته: سایدبار قابل جمع‌شدن، نوار بالایی با جست‌وجوی سراسری، صفحه‌ی Dashboards با KPI و نمودار، صفحه‌ی Discover با جدول لاگ قابل جست‌وجو/فیلتر، و صفحه‌ی Visualize برای ساخت نمودار. رابط کاربری کاملاً **دوزبانه** است (فارسی/RTL و انگلیسی/LTR) با یک سوییچ زبان در نوار بالا.

## پشته‌ی فنی

| بخش | ابزار |
|---|---|
| فریم‌ورک | Next.js 16 (App Router) + TypeScript 6 |
| کامپوننت‌ها و تم | MUI v9 (`ThemeProvider` سفارشی، حالت روشن/تیره، جهت RTL/LTR) |
| استایل کمکی | Tailwind CSS v4 — پیکربندی CSS-first (`@theme` در `globals.css`، بدون `tailwind.config.*`)؛ preflight آن خاموش است تا با MUI تداخل نکند |
| RTL برای MUI/Emotion | `stylis-plugin-rtl` (یک cache دوم برای Emotion که فقط در حالت فارسی فعال می‌شود) |
| فونت | IBM Plex Sans/Mono (انگلیسی و داده‌های عددی) + Vazirmatn (فارسی) — هر دو همیشه بارگذاری می‌شوند |
| HTTP client | axios (یک instance مرکزی + interceptors، پیام خطا هم دوزبانه است) |
| مدیریت داده‌ی سرور | TanStack Query (React Query) |
| مدیریت state سبک UI | Zustand v5 (تم، سایدبار/نوار موبایل، **زبان**، با persist در localStorage) |
| جدول و نمودار | `@mui/x-data-grid`, `@mui/x-charts` (نسخه‌ی ۹ — API اسلات‌محور: `slotProps`, `hideLegend`) |
| Lint | ESLint 9 (flat config در `eslint.config.mjs`) |
| تاریخ | dayjs |

## ساختار پروژه

```
src/
  app/                      # مسیرهای Next.js (App Router)
    layout.tsx              # layout ریشه: فونت‌ها (Plex + Vazirmatn) + Providers + dir/lang پیش‌فرض
    page.tsx                # ریدایرکت به /dashboards
    providers.tsx           # ترکیب QueryProvider + ThemeRegistry
    (dashboard)/            # همه‌ی صفحات پشت AppShell (سایدبار/نوار بالا) — همه client component
      layout.tsx
      dashboards/page.tsx
      discover/page.tsx
      visualize/page.tsx
      management/page.tsx
  components/
    layout/                 # AppShell, Sidebar, TopBar, LanguageSwitcher, ThemeRegistry, QueryProvider
    common/                 # PageHeader, PanelCard, StatCard, DataTable, SearchBar, LogLevelChip, ...
    charts/                 # TimeSeriesChart, CategoryBarChart, StatusDonutChart
  theme/                    # پالت رنگ، تایپوگرافی (فونت به ازای هر زبان)، override کامپوننت‌های MUI
  i18n/                     # همه‌ی رشته‌های رابط کاربری — جزئیات پایین‌تر
    config.ts               # لیست زبان‌ها + زبان پیش‌فرض + جهت هرکدام (rtl/ltr)
    dictionary.types.ts     # شکل یکتای دیکشنری که هر دو زبان باید پیاده‌اش کنند
    locales/en.ts, fa.ts    # متن‌های واقعی هر زبان
    useTranslation.ts       # هوک `const { t, locale, dir } = useTranslation()`
  hooks/usePageTitle.ts     # عنوان تب مرورگر را دوزبانه و پویا تنظیم می‌کند
  lib/
    axios/                  # axiosInstance + interceptors (پیام خطا بر اساس زبان جاری)
    api/
      endpoints.ts          # مسیرهای API در یک جا
      services/             # توابع فراخوانی axios به ازای هر resource
      queries/               # هوک‌های React Query آماده روی همان services
  store/uiStore.ts          # Zustand: themeMode, sidebarOpen, locale
  types/                    # تایپ‌های دامنه (Dashboard, Discover, API)
  mock/                     # داده‌ی نمونه برای رندر شدن UI بدون بک‌اند واقعی
  config/navigation.tsx     # لیست آیتم‌های سایدبار (فقط key و آیکون؛ متن از i18n می‌آید)
  utils/                    # formatDate, cn (className helper)
```

### چرا این ساختار ماژولار است

- برای اضافه کردن یک صفحه‌ی جدید: یک پوشه زیر `src/app/(dashboard)/` بسازید، یک آیتم به `src/config/navigation.tsx` اضافه کنید، و یک بخش متناظر به `Dictionary` و هر دو فایل `en.ts`/`fa.ts` اضافه کنید؛ چیز دیگری در Sidebar لازم نیست تغییر کند.
- برای اتصال یک بخش به API واقعی: در `src/lib/api/endpoints.ts` مسیر را اضافه کنید، یک تابع در `services/` بنویسید، یک هوک React Query در `queries/` بسازید، و در صفحه‌ی مربوطه به‌جای import از `src/mock` از همان هوک استفاده کنید.
- تم (رنگ‌ها/فونت/فاصله‌گذاری) فقط در `src/theme/` تعریف شده؛ تغییر برند یا حالت رنگی فقط همان‌جا انجام می‌شود.

## دوزبانگی و RTL — چطور کار می‌کند

هدف این بود که پشتیبانی از فارسی/انگلیسی با **کمترین تغییر ساختاری** اضافه شود؛ ایده‌ی اصلی این است: یک منبع واحد برای متن‌ها + یک سوییچ در سطح تم برای جهت، نه تغییر تک‌تک کامپوننت‌ها.

1. **متن‌ها** — هر رشته‌ی قابل‌مشاهده در `src/i18n/dictionary.types.ts` تعریف شده و `locales/en.ts` و `locales/fa.ts` دقیقاً همان شکل را با متن خودشان پیاده می‌کنند. اگر کلیدی در یکی از دو فایل جا بیفتد، TypeScript در زمان build خطا می‌دهد — نه این‌که در تولید یک متن خالی دیده شود.
   کامپوننت‌ها به‌جای متن ثابت، از `const { t } = useTranslation()` و مثلاً `t.nav.dashboards.label` استفاده می‌کنند.
2. **زبان جاری** در `src/store/uiStore.ts` (Zustand) نگه‌داری و در `localStorage` ذخیره می‌شود — دقیقاً مثل حالت روشن/تیره‌ی تم.
3. **جهت (RTL/LTR)** از زبان جاری مشتق می‌شود (`src/i18n/config.ts`). `ThemeRegistry` این جهت را به `theme.direction` در MUI می‌دهد و هم‌زمان بین دو **Emotion cache** سوییچ می‌کند: یکی معمولی، و دیگری با `stylis-plugin-rtl` که خروجی CSS تولیدشده توسط `sx` را به‌صورت خودکار آینه می‌کند (مثلاً `margin-right` در فارسی به‌طور خودکار `margin-left` می‌شود). به همین دلیل کامپوننت‌هایی مثل Sidebar/TopBar/StatCard نیازی به نوشتن دو نسخه یا استفاده از property های منطقی (`marginInlineStart` و…) ندارند — همان کدی که برای LTR نوشته شده، خودکار برای RTL هم درست کار می‌کند.
4. **فونت** — چون فارسی یک خط پیوسته (cursive) است، به فونت مخصوص خودش نیاز دارد: Vazirmatn برای فارسی، IBM Plex Sans برای انگلیسی. هر دو همیشه در `layout.tsx` بارگذاری می‌شوند (پس سوییچ زبان درخواست شبکه‌ی جدید نمی‌خواهد)، و `theme/typography.ts` بر اساس زبان جاری متغیر CSS درست را انتخاب می‌کند. اعداد/تاریخ/نام سرویس‌ها همیشه با IBM Plex Mono و ارقام لاتین نمایش داده می‌شوند (حتی در حالت فارسی) چون داده‌ی فنی هستند، نه محتوای زبانی.
5. **سوییچ زبان** آیکون مترجم (🌐) در نوار بالا (TopBar ← LanguageSwitcher) است.

### چه چیزهایی عمداً ترجمه نشده‌اند

نام سرویس‌ها/میزبان‌ها (`checkout-service`, `ip-10-0-1-12`)، متن پیام‌های لاگ نمونه، و برچسب سطح لاگ (`INFO`/`WARN`/`ERROR`/`DEBUG`) — این‌ها شناسه‌های فنی‌اند نه بخشی از رابط کاربری، و در ابزارهای مانیتورینگ واقعی (از جمله خود Kibana) معمولاً حتی در نسخه‌های محلی‌سازی‌شده هم به همین شکل انگلیسی باقی می‌مانند.

### اضافه کردن یک زبان سوم

1. یک فایل جدید مثل `src/i18n/locales/ar.ts` بسازید که `Dictionary` را پیاده کند (TypeScript همه‌ی کلیدهای جا افتاده را نشان می‌دهد).
2. آن را در `src/i18n/index.ts` به آبجکت `dictionaries` اضافه کنید.
3. یک ورودی به `locales` و `localeMeta` در `src/i18n/config.ts` اضافه کنید (جهت rtl/ltr را مشخص کنید).
4. اگر زبان جدید فونت مخصوص خودش را می‌خواهد، مثل Vazirmatn در `layout.tsx` و `theme/typography.ts` اضافه‌اش کنید.

همین — منوی زبان در TopBar و سوییچ جهت/تم به‌طور خودکار زبان جدید را هم پوشش می‌دهند.

## واکنش‌گرایی موبایل — چطور کار می‌کند

مرز اصلی، breakpoint استاندارد `md` در MUI (۹۰۰ پیکسل) است: از `md` به بالا چیدمان دسکتاپ فعلی بدون تغییر کار می‌کند؛ زیر آن، سایدبار و نوار بالا به حالت موبایل می‌روند.

1. **سایدبار** (`Sidebar.tsx`) حالا دو `Drawer` رندر می‌کند که فقط یکی‌شان با CSS در هر لحظه دیده می‌شود: همان Drawer دائمی/قابل‌جمع‌شدن قبلی برای `md`+، و یک Drawer موقت (overlay) برای زیر `md` که با دکمه‌ی همبرگری در TopBar باز می‌شود، همیشه لیبل کامل نشان می‌دهد (نه حالت آیکون‌تنها)، و با کلیک روی هر آیتم یا کلیک بیرون از آن خودش بسته می‌شود. محتوای نویگیشن (`NavList`, `BrandRow`) بین این دو به اشتراک گذاشته شده تا از دوباره‌نویسی/واگرایی جلوگیری شود.
2. **وضعیت باز/بسته‌ی این Drawer موقت** یک فیلد جدید در `uiStore.ts` است (`mobileNavOpen` + `openMobileNav`/`closeMobileNav`) — عمداً از حالت‌های ماندگار (`themeMode`, `sidebarOpen`, `locale`) جدا نگه داشته شده و در localStorage ذخیره نمی‌شود (`partialize` در تنظیمات persist)، چون یک overlay موقتی هر بار باید با حالت بسته شروع شود.
3. **نوار بالا** (`TopBar.tsx`): زیر `md` دکمه‌ی همبرگر (☰) ظاهر می‌شود که همان Drawer موقت را باز می‌کند. انتخاب‌گر بازه‌ی زمانی (که عرض ثابت ۱۶۸px دارد) زیر `sm` (۶۰۰px) جایش را به یک آیکون ساعت + منوی کشویی می‌دهد که همان مقدار را تغییر می‌دهد — یعنی قابلیت حذف نمی‌شود، فقط جمع‌تر می‌شود. آیکون اعلان‌ها (که فعلاً چیزی در آن پر نمی‌شود) زیر `sm` مخفی می‌شود تا جا برای جست‌وجو باز بماند؛ جست‌وجو، سوییچ زبان، تغییر تم و آواتار در همه‌ی اندازه‌ها دیده می‌شوند.
4. **`AppShell.tsx` بدون تغییر ماند** — چون Drawer موقت یک overlay است (خارج از جریان عادی چیدمان)، وقتی زیر `md` هستیم Drawer دائمی با `display:none` عرض صفر می‌گیرد و `main` به‌طور خودکار تمام عرض صفحه را می‌گیرد؛ چیزی در چیدمان flex بیرونی نیاز به دستکاری نداشت.
5. **Viewport/theme-color** — `src/app/layout.tsx` حالا یک `viewport` export صریح دارد (`width: 'device-width'`, `initialScale: 1`) به‌علاوه‌ی `themeColor` متناسب با پالت روشن/تیره، برای رنگ‌آمیزی نوار آدرس مرورگرهای موبایل.
6. **صفحات محتوایی** (Dashboards/Visualize/Management) از قبل با گرید Tailwind/CSS Grid موبایل-محور نوشته شده بودند (`grid-cols-1` در پایه، ستون بیشتر فقط از `sm`/`lg` به بعد) و نیازی به تغییر نداشتند.

### یک مصالحه‌ی آگاهانه

جدول لاگ در Discover (`@mui/x-data-grid`) روی موبایل به‌جای بازچینی به کارت، به‌صورت افقی داخل خودش اسکرول می‌شود — همان رفتاری که Kibana و Grafana هم روی صفحه‌ی کوچک دارند. تبدیل کامل جدول به لیست کارتی روی موبایل ممکن است، اما یک بازطراحی جداگانه است، نه یک تغییر واکنش‌گرا؛ اگر لازم شد می‌توان جداگانه اضافه‌اش کرد.

## اجرا در حالت توسعه

```bash
npm install
cp .env.example .env   # در صورت نیاز NEXT_PUBLIC_API_BASE_URL را تغییر دهید
npm run dev
```

سپس http://localhost:3000 را باز کنید. زبان پیش‌فرض فارسی است؛ برای تغییر پیش‌فرض کافی‌ست مقدار `DEFAULT_LOCALE` در `src/i18n/config.ts` را عوض کنید.

> صفحات Dashboards و Discover فعلاً با داده‌ی mock (در `src/mock/`) رندر می‌شوند تا بدون بک‌اند هم قابل مشاهده باشند. هوک‌های آماده‌ی اتصال به API واقعی در `src/lib/api/queries/` هستند؛ همان‌جا که در کامنت هر صفحه اشاره شده، جایگزین mock کنید.

## اجرا با Docker

```bash
docker compose up --build
```

این کار یک image چندمرحله‌ای (deps → builder → runner) بر پایه‌ی خروجی `standalone` نکست می‌سازد و روی پورت `3000` بالا می‌آورد (قابل تغییر با متغیر `PORT` در `.env`). برای تغییر آدرس بک‌اند در build:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api docker compose up --build
```

(چون `NEXT_PUBLIC_*` در زمان build داخل باندل کلاینت جاسازی می‌شود، باید موقع build ست شود، نه فقط موقع اجرا — این موضوع در Dockerfile و docker-compose.yml کامنت‌گذاری شده.)

## نکات بعدی که می‌توانید اضافه کنید

- احراز هویت واقعی (در حال حاضر `interceptors.ts` فقط جای خالی خواندن توکن از `localStorage` و مدیریت ۴۰۱ را آماده کرده).
- صفحه‌ی جزئیات یک لاگ (کلیک روی یک ردیف در Discover).
- ذخیره‌سازی واقعی dashboard/visualization به‌جای لیست ثابت در `visualize/page.tsx`.
- یک URL segment اختیاری برای زبان (مثل `/fa/dashboards`) اگر روزی به SEO چندزبانه یا لینک قابل‌اشتراک‌گذاری با زبان مشخص نیاز پیدا کردید — نسخه‌ی فعلی زبان را فقط در مرورگر (client-side) نگه می‌دارد که برای یک ابزار داخلی/پنل مدیریتی کافی است.
- نمایش کارتی (به‌جای جدول با اسکرول افقی) برای جدول لاگ در Discover روی موبایل، اگر دسترسی سریع‌تر به هر ردیف روی گوشی اولویت پیدا کرد.
