import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import SocialIcon from "@/components/ui/SocialIcon";
import { siteConfig } from "@/data/site";
import { footerLinkColumns } from "@/data/nav";

const socials = [
  { name: "instagram" as const, href: siteConfig.social.instagram, label: "اینستاگرام" },
  { name: "telegram" as const, href: siteConfig.social.telegram, label: "تلگرام" },
  { name: "whatsapp" as const, href: siteConfig.social.whatsapp, label: "واتساپ" },
  { name: "linkedin" as const, href: siteConfig.social.linkedin, label: "لینکدین" },
];

export default function Footer({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-slate-950">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded data URL, not an optimizable asset
              <img src={logoUrl} alt={siteConfig.name} className="h-9 w-9 rounded-xl object-contain" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M12 6.5 17 8.8v3.3c0 3.4-2 5.9-5 7.1-3-1.2-5-3.7-5-7.1V8.8L12 6.5Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            )}
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
            {siteConfig.footerAbout}
          </p>
          <a
            href={`tel:${siteConfig.contact.phone.replace(/-/g, "")}`}
            className="mt-5 flex items-center gap-2 text-base font-bold text-teal-700 dark:text-teal-400"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.contact.phone}
          </a>
          <div className="mt-5 flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-teal-600 hover:ring-teal-300 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10"
              >
                <SocialIcon name={s.name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {footerLinkColumns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            راه‌های تماس
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <span>{siteConfig.contact.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-teal-700 dark:hover:text-teal-400">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
              <span dir="ltr">{siteConfig.contact.mobile}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-slate-200 dark:border-white/5">
        <Container className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} تمامی حقوق این وب‌سایت متعلق به{" "}
            {siteConfig.name} است.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 text-center text-[10px] leading-tight text-slate-400 dark:border-white/10 dark:text-slate-600">
              جای نماد
              <br />
              اینماد
            </div>
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 text-center text-[10px] leading-tight text-slate-400 dark:border-white/10 dark:text-slate-600">
              جای نماد
              <br />
              ساماندهی
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
