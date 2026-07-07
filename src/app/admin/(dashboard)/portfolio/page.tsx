import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EntityManager from "@/components/admin/EntityManager";
import { listPortfolio, type PortfolioRow } from "@/lib/db";
import { gradientOptions } from "@/data/gradients";

export default function AdminPortfolioPage() {
  const items = listPortfolio();

  return (
    <div>
      <AdminPageHeader
        title="نمونه‌کارها"
        description="پروژه‌هایی که در بخش «نمونه‌کارها»ی صفحه اصلی نمایش داده می‌شوند."
      />

      <EntityManager<PortfolioRow>
        apiBase="/api/admin/portfolio"
        addLabel="افزودن نمونه‌کار"
        emptyLabel="هنوز نمونه‌کاری ثبت نشده است."
        initialItems={items}
        columns={[
          { key: "title", label: "عنوان" },
          { key: "category", label: "دسته‌بندی" },
        ]}
        fields={[
          { name: "title", label: "عنوان", type: "text" },
          { name: "category", label: "دسته‌بندی", type: "text" },
          { name: "description", label: "توضیحات", type: "textarea" },
          { name: "gradient", label: "رنگ پس‌زمینه", type: "select", options: [...gradientOptions] },
        ]}
      />
    </div>
  );
}
