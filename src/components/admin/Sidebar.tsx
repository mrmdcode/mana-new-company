"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  CreditCard,
  Globe,
  Images,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Megaphone,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/portfolio", label: "نمونه‌کارها", icon: Images },
  { href: "/admin/partners", label: "همکاران", icon: Users },
  { href: "/admin/news", label: "اخبار", icon: Newspaper },
  { href: "/admin/newsletter", label: "مشترکین خبرنامه", icon: Megaphone },
  { href: "/admin/messages", label: "پیام‌های تماس", icon: Mail },
  { href: "/admin/domains", label: "دامنه‌ها", icon: Globe },
  { href: "/admin/gateways", label: "درگاه‌ها", icon: CreditCard },
  { href: "/admin/transactions", label: "تراکنش‌ها", icon: ListChecks },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/40 md:w-64 md:border-e">
      <div className="border-b border-slate-100 p-5 dark:border-white/5">
        <p className="text-sm font-bold text-slate-900 dark:text-white">پنل مدیریت</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">نهان آریا</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              }`}
            >
              <ItemIcon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-100 p-3 dark:border-white/5">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
        >
          مشاهده سایت
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut className="h-4.5 w-4.5" />
          خروج
        </button>
      </div>
    </aside>
  );
}
