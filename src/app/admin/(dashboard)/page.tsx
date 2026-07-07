import Link from "next/link";
import { Images, Mail, Megaphone, Newspaper, Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { countSubscribers, listMessages, listNews, listPartners, listPortfolio } from "@/lib/db";

export default function AdminDashboardPage() {
  const cards = [
    {
      href: "/admin/portfolio",
      label: "نمونه‌کارها",
      value: listPortfolio().length,
      icon: Images,
    },
    {
      href: "/admin/partners",
      label: "همکاران",
      value: listPartners().length,
      icon: Users,
    },
    {
      href: "/admin/news",
      label: "اخبار",
      value: listNews().length,
      icon: Newspaper,
    },
    {
      href: "/admin/newsletter",
      label: "مشترکین خبرنامه",
      value: countSubscribers(),
      icon: Megaphone,
    },
    {
      href: "/admin/messages",
      label: "پیام‌های تماس",
      value: listMessages().length,
      icon: Mail,
    },
  ];

  return (
    <div>
      <AdminPageHeader title="داشبورد" description="خلاصه‌ای از محتوای مدیریت‌شده سایت." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const CardIcon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <CardIcon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
