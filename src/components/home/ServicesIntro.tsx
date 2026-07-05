import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { services } from "@/data/services";

export default function ServicesIntro() {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-24 dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="خدمات ما"
          title="راهکارهایی برای رشد امن کسب‌وکار شما"
          description="از اتوماسیون فرآیندهای اداری تا طراحی سایت و صحت‌سنجی هویت؛ هر آنچه یک کسب‌وکار دیجیتال برای شروع و رشد نیاز دارد."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-7 transition hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60 dark:border-white/5 dark:bg-white/[0.03] dark:hover:border-teal-500/30 dark:hover:bg-white/[0.06] dark:hover:shadow-none"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20">
                <Icon name={service.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                {service.title}
              </h3>
              <p className="mt-2.5 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
