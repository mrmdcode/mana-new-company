export type NavLink = {
  href: string;
  label: string;
};

export const mainNav: NavLink[] = [
  { href: "/", label: "خانه" },
  { href: "/#services", label: "خدمات" },
  { href: "/#scenarios", label: "حوزه‌های فعالیت" },
  { href: "/#roadmap", label: "روند کار" },
  { href: "/#portfolio", label: "نمونه‌کارها" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/contact", label: "تماس با ما" },
];

export const footerLinkColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "دسترسی سریع",
    links: [
      { href: "/", label: "خانه" },
      { href: "/#services", label: "خدمات ما" },
      { href: "/#scenarios", label: "حوزه‌های فعالیت" },
      { href: "/#roadmap", label: "فرآیند همکاری" },
      { href: "/#portfolio", label: "نمونه‌کارها" },
    ],
  },
  {
    title: "شرکت",
    links: [
      { href: "/contact", label: "تماس با ما" },
      { href: "/blog", label: "وبلاگ" },
      { href: "/#news", label: "اخبار و رویدادها" },
      { href: "/#partners", label: "همکاران ما" },
      { href: "/#hero", label: "درباره ما" },
    ],
  },
  {
    title: "خدمات",
    links: [
      { href: "/#services", label: "اتوماسیون سازمانی" },
      { href: "/#services", label: "طراحی سایت شرکتی و فروشگاهی" },
      { href: "/#services", label: "صحت‌سنجی کد ملی" },
      { href: "/#services", label: "خدمات اشتراکی نرم‌افزاری" },
    ],
  },
];
