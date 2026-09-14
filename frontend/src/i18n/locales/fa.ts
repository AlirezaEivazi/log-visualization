import type { Dictionary } from '../dictionary.types';

export const fa: Dictionary = {
  nav: {
    dashboards: { label: 'داشبورد‌ها', description: 'نمای کلی از فعالیت سیستم' },
    discover: { label: 'کاوش', description: 'جست‌وجو و بررسی رویدادهای خام لاگ' },
    visualize: { label: 'تجسم‌سازی', description: 'ساخت نمودار از داده‌ها' },
    management: { label: 'مدیریت', description: 'منابع داده، الگوهای ایندکس و تنظیمات' },
  },
  sidebar: {
    toggle: 'باز/بسته کردن نوار کناری',
  },
  topbar: {
    searchPlaceholder: 'جست‌وجوی رویدادها، میزبان‌ها، سرویس‌ها…',
    timeRanges: ['۱۵ دقیقه اخیر', '۱ ساعت اخیر', '۲۴ ساعت اخیر', '۷ روز اخیر'],
    lightMode: 'تغییر به حالت روشن',
    darkMode: 'تغییر به حالت تیره',
    notifications: 'اعلان‌ها',
    language: 'زبان',
  },
  dashboards: {
    title: 'نمای کلی',
    subtitle: 'فعالیت سیستم در تمام سرویس‌های متصل',
    vsYesterday: 'نسبت به دیروز',
    stats: {
      events: 'رویدادها (۲۴ ساعت)',
      uptime: 'زمان کارکرد',
      latency: 'تأخیر p95',
      alerts: 'هشدارهای فعال',
    },
    eventsOverTime: { title: 'رویدادها در طول زمان', subtitle: '۲۴ ساعت گذشته' },
    responseStatus: { title: 'وضعیت پاسخ‌ها', subtitle: 'سهم درخواست‌ها بر اساس کلاس وضعیت' },
    topSources: { title: 'برترین منابع', subtitle: 'حجم رویداد بر اساس سرویس' },
  },
  discover: {
    title: 'کاوش',
    subtitle: 'جست‌وجو و بررسی رویدادهای خام لاگ',
    searchPlaceholder: 'جست‌وجو در پیام، سرویس، میزبان…',
    panelTitle: 'جریان لاگ',
    panelSubtitleCount: (shown, total) =>
      `${total.toLocaleString('en-US')} رویداد (${shown.toLocaleString('en-US')} مورد نمایش داده‌شده)`,
    emptyTitle: 'هیچ رویدادی با این جست‌وجو مطابقت ندارد',
    emptyDescription: 'یک فیلتر سطح را بردارید یا عبارت جست‌وجو را تغییر دهید.',
    columns: { time: 'زمان', level: 'سطح', service: 'سرویس', host: 'میزبان', message: 'پیام' },
    mockNotice:
      'این صفحه داده‌های نمایشی (mock) را نشان می‌دهد — برای اتصال به بک‌اند واقعی، NEXT_PUBLIC_API_BASE_URL را تنظیم کنید.',
  },
  visualize: {
    title: 'تجسم‌سازی',
    subtitle: 'نموداری جدید بسازید یا یکی از موارد ذخیره‌شده را باز کنید',
    createButton: 'ساخت تجسم‌سازی',
    chooseChartType: 'یک نوع نمودار انتخاب کنید',
    chartTypes: {
      line: { label: 'خطی', description: 'دنبال کردن یک معیار در طول زمان' },
      bar: { label: 'میله‌ای', description: 'مقایسه مقادیر بین دسته‌ها' },
      donut: { label: 'حلقه‌ای', description: 'نمایش سهم هر بخش از کل' },
    },
    previewTitle: 'پیش‌نمایش',
    previewSubtitle: 'ساخته‌شده از داده‌های نمونه',
    savedTitle: 'تجسم‌سازی‌های ذخیره‌شده',
    saved: {
      events: { title: 'رویدادها در طول زمان', subtitle: '۲۴ ساعت گذشته' },
      sources: { title: 'برترین منابع', subtitle: 'بر اساس حجم رویداد' },
      status: { title: 'وضعیت پاسخ‌ها', subtitle: 'بر اساس کلاس وضعیت' },
    },
  },
  management: {
    title: 'مدیریت',
    subtitle: 'منابع داده، الگوهای ایندکس و تنظیمات پلتفرم',
    sections: {
      indexPatterns: {
        title: 'الگوهای ایندکس',
        description: 'مشخص کردن اینکه Discover و Visualize کدام منابع داده را می‌توانند جست‌وجو کنند.',
      },
      dataSources: {
        title: 'منابع داده',
        description: 'اتصال و پیکربندی سرویس‌ها و پایگاه‌های داده‌ی بالادستی.',
      },
      alertRules: {
        title: 'قوانین هشدار',
        description: 'تعیین آستانه‌هایی که به‌طور خودکار اعلان ایجاد می‌کنند.',
      },
      apiKeys: {
        title: 'کلیدهای API',
        description: 'صدور و لغو اعتبارنامه‌های مورد استفاده برای فراخوانی API.',
      },
      usersRoles: {
        title: 'کاربران و نقش‌ها',
        description: 'کنترل اینکه چه کسی می‌تواند داشبورد‌ها و داده‌ها را ببیند یا ویرایش کند.',
      },
      retention: {
        title: 'سیاست نگهداری',
        description: 'تعیین مدت‌زمان نگهداری رویدادهای خام پیش از حذف.',
      },
    },
  },
};
