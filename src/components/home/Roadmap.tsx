import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { roadmap } from "@/data/roadmap";

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      className="scroll-mt-24 bg-slate-50 py-24 dark:bg-slate-900/40"
    >
      <Container>
        <SectionHeading
          eyebrow="روند همکاری"
          title="از ایده تا تحویل؛ نقشه راه پروژه شما"
          description="شفافیت در تمام مراحل، از اولین مشاوره تا پشتیبانی پس از تحویل، اصل کار ماست."
        />

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute right-6 top-2 bottom-2 w-px bg-gradient-to-b from-teal-400 via-slate-300 to-transparent lg:right-1/2"
          />

          <ol className="space-y-8">
            {roadmap.map((item, index) => {
              const isEven = index % 2 === 1;
              return (
                <li key={item.step} className="relative">
                  <div
                    className={`flex items-start gap-4 lg:w-1/2 ${
                      isEven ? "lg:mr-auto lg:flex-row-reverse lg:text-start" : ""
                    }`}
                  >
                    <span className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-teal-300 ring-8 ring-slate-50 dark:ring-slate-900/40">
                      {item.step}
                    </span>
                    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/5 dark:bg-white/[0.03]">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
