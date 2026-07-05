import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { scenarios } from "@/data/scenarios";

export default function Scenarios() {
  return (
    <section
      id="scenarios"
      className="scroll-mt-24 bg-white py-24 dark:bg-slate-950"
    >
      <Container>
        <SectionHeading
          eyebrow="حوزه‌های فعالیت"
          title="سناریوهایی که در آن‌ها فعالیت می‌کنیم"
          description="طیفی از راهکارهای فنی که برای صنایع و کسب‌وکارهای گوناگون طراحی و اجرا می‌کنیم."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.title}
              className="relative overflow-hidden rounded-2xl bg-slate-900 p-7 text-white"
            >
              <span className="absolute -left-4 -top-6 text-7xl font-black text-white/5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                <Icon name={scenario.icon} className="h-5.5 w-5.5" />
              </div>
              <h3 className="relative mt-5 text-lg font-bold">{scenario.title}</h3>
              <p className="relative mt-2.5 text-sm leading-7 text-slate-300">
                {scenario.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
