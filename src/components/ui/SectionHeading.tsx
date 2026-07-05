export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`mx-auto max-w-2xl ${
        align === "center" ? "text-center" : "text-start"
      }`}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-teal-50 px-4 py-1 text-sm font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      )}
    </div>
  );
}
