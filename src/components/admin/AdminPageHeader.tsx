export default function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{title}</h1>
      {description && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
  );
}
