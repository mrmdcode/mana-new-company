import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Building2 } from "lucide-react";
import { partners } from "@/data/partners";

export default function Partners() {
  return (
    <section
      id="partners"
      className="scroll-mt-24 bg-slate-50 py-24 dark:bg-slate-900/40"
    >
      <Container>
        <SectionHeading
          eyebrow="همکاران ما"
          title="شرکت‌هایی که به ما اعتماد کرده‌اند"
          description="افتخار همکاری با مجموعه‌ای از سازمان‌ها و کسب‌وکارهای فعال در حوزه‌های مختلف را داریم."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60 dark:border-white/5 dark:bg-white/[0.03] dark:hover:shadow-none"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <Building2 className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {partner.name}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  {partner.field}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
