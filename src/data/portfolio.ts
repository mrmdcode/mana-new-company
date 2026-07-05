export type PortfolioItem = {
  title: string;
  category: string;
  description: string;
  gradient: string;
};

export const portfolio: PortfolioItem[] = [
  {
    title: "سامانه اتوماسیون اداری آریا",
    category: "اتوماسیون سازمانی",
    description: "دیجیتالی‌سازی گردش مکاتبات و فرآیندهای تأیید برای یک هلدینگ صنعتی.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    title: "فروشگاه اینترنتی کیان‌مارکت",
    category: "طراحی فروشگاهی",
    description: "طراحی و توسعه فروشگاه اینترنتی چندفروشنده با درگاه پرداخت اختصاصی.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    title: "وب‌سرویس صحت‌سنجی هویت",
    category: "صحت‌سنجی کد ملی",
    description: "پیاده‌سازی API استعلام و تطبیق کد ملی برای یک درگاه ثبت‌نام آنلاین.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "پلتفرم اشتراک نرم‌افزاری سان‌کلاد",
    category: "خدمات اشتراکی",
    description: "طراحی مدل SaaS با پلن‌های اشتراک ماهانه و پنل مدیریت مشترکین.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    title: "سایت شرکتی گروه صنعتی البرز",
    category: "طراحی سایت شرکتی",
    description: "طراحی وب‌سایت معرفی شرکت با تمرکز بر سئو و سرعت بارگذاری بالا.",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    title: "داشبورد امنیت اطلاعات نهان",
    category: "امنیت اطلاعات",
    description: "مانیتورینگ لحظه‌ای رخدادهای امنیتی و گزارش‌گیری برای تیم‌های فنی.",
    gradient: "from-emerald-500 to-teal-600",
  },
];
