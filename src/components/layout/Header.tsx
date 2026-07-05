"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import Container from "@/components/ui/Container";
import { mainNav } from "@/data/nav";
import { siteConfig } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur dark:bg-slate-950/90"
          : "bg-white/60 backdrop-blur dark:bg-slate-950/60"
      } border-b border-slate-100 dark:border-white/5`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20">
            <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none">
              <path
                d="M12 2.5 20 6v6c0 5.2-3.4 8.9-8 10.5-4.6-1.6-8-5.3-8-10.5V6l8-3.5Z"
                fill="currentColor"
                fillOpacity="0.25"
              />
              <path
                d="M12 6.5 17 8.8v3.3c0 3.4-2 5.9-5 7.1-3-1.2-5-3.7-5-7.1V8.8L12 6.5Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold text-slate-900 sm:text-lg dark:text-white">
              {siteConfig.shortName}
            </span>
            <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              محافظ اسرار نهان آریا
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/-/g, "")}`}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <Phone className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            {siteConfig.contact.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            مشاوره رایگان
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 lg:hidden dark:text-slate-200"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden dark:border-white/5 dark:bg-slate-950">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              مشاوره رایگان
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
