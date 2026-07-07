import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EntityManager from "@/components/admin/EntityManager";
import { listNews, type NewsRow } from "@/lib/db";

export default function AdminNewsPage() {
  const items = listNews();

  return (
    <div>
      <AdminPageHeader
        title="اخبار"
        description="آخرین اخبار شرکت که در صفحه اصلی نمایش داده می‌شوند (۱۰ خبر آخر به‌صورت خودکار انتخاب می‌شوند)."
      />

      <EntityManager<NewsRow>
        apiBase="/api/admin/news"
        addLabel="افزودن خبر"
        emptyLabel="هنوز خبری ثبت نشده است."
        initialItems={items}
        columns={[
          { key: "date", label: "تاریخ" },
          { key: "title", label: "عنوان" },
        ]}
        fields={[
          { name: "date", label: "تاریخ (مثال: ۱۴۰۴/۰۴/۱۰)", type: "text" },
          { name: "title", label: "عنوان", type: "text" },
          { name: "excerpt", label: "خلاصه خبر", type: "textarea" },
        ]}
      />
    </div>
  );
}
