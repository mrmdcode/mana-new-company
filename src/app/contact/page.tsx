import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SocialIcon from "@/components/ui/SocialIcon";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "راه‌های ارتباطی با شرکت محافظ اسرار نهان آریا؛ برای مشاوره رایگان و ثبت درخواست پروژه با ما در تماس باشید.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `تماس با ما | ${siteConfig.name}`,
    description:
      "راه‌های ارتباطی با شرکت محافظ اسرار نهان آریا؛ برای مشاوره رایگان و ثبت درخواست پروژه با ما در تماس باشید.",
    url: `${siteConfig.url}/contact`,
  },
};

const infoCards = [
  {
    icon: Phone,
    title: "تلفن تماس",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/-/g, "")}`,
  },
  {
    icon: Mail,
    title: "ایمیل",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: MapPin,
    title: "آدرس دفتر",
    value: siteConfig.contact.address,
  },
  {
    icon: Clock,
    title: "ساعات پاسخگویی",
    value: siteConfig.contact.workHours,
  },
];

const socials = [
  { name: "instagram" as const, href: siteConfig.social.instagram, label: "اینستاگرام" },
  { name: "telegram" as const, href: siteConfig.social.telegram, label: "تلگرام" },
  { name: "whatsapp" as const, href: siteConfig.social.whatsapp, label: "واتساپ" },
  { name: "linkedin" as const, href: siteConfig.social.linkedin, label: "لینکدین" },
];

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-100 bg-slate-50 py-16 dark:border-white/5 dark:bg-slate-900/40 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="تماس با ما"
            title="خوشحال می‌شویم صدای شما را بشنویم"
            description="برای مشاوره رایگان، ارائه قیمت یا هر پرسشی درباره خدمات، فرم زیر را پر کنید یا مستقیم با ما تماس بگیرید."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {infoCards.map((card) => {
                const CardIcon = card.icon;
                const content = (
                  <>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                      <CardIcon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                      {card.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {card.value}
                    </p>
                  </>
                );
                return card.href ? (
                  <a
                    key={card.title}
                    href={card.href}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-200 hover:shadow-md dark:border-white/5 dark:bg-white/[0.03]"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-white/[0.03]"
                  >
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-white/[0.03]">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                ما را در شبکه‌های اجتماعی دنبال کنید
              </p>
              <div className="mt-4 flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200 transition hover:text-teal-600 hover:ring-teal-300 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10"
                  >
                    <SocialIcon name={s.name} className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>
    </div>
  );
}
