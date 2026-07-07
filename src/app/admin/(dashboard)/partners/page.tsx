import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EntityManager from "@/components/admin/EntityManager";
import { listPartners, type PartnerRow } from "@/lib/db";

export default function AdminPartnersPage() {
  const items = listPartners();

  return (
    <div>
      <AdminPageHeader
        title="همکاران"
        description="شرکت‌هایی که در بخش «همکاران ما»ی صفحه اصلی نمایش داده می‌شوند."
      />

      <EntityManager<PartnerRow>
        apiBase="/api/admin/partners"
        addLabel="افزودن همکار"
        emptyLabel="هنوز همکاری ثبت نشده است."
        initialItems={items}
        columns={[
          { key: "name", label: "نام شرکت" },
          { key: "field", label: "حوزه فعالیت" },
        ]}
        fields={[
          { name: "name", label: "نام شرکت", type: "text" },
          { name: "field", label: "حوزه فعالیت", type: "text" },
        ]}
      />
    </div>
  );
}
