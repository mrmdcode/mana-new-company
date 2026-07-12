import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EntityManager from "@/components/admin/EntityManager";
import { listDomains, type MerchantDomainRow } from "@/lib/db";

export default function AdminDomainsPage() {
  const items = listDomains();

  return (
    <div>
      <AdminPageHeader
        title="دامنه‌ها"
        description="کسب‌وکارها و دامنه‌هایی که برایشان merchantID صادر شده است."
      />

      <EntityManager<MerchantDomainRow>
        apiBase="/api/admin/domains"
        addLabel="افزودن دامنه"
        emptyLabel="هنوز دامنه‌ای ثبت نشده است."
        initialItems={items}
        columns={[
          { key: "name", label: "نام کسب‌وکار" },
          { key: "domain", label: "دامنه" },
          { key: "merchant_id", label: "merchantID" },
          { key: "status", label: "وضعیت" },
        ]}
        fields={[
          { name: "name", label: "نام کسب‌وکار", type: "text" },
          { name: "domain", label: "دامنه (مثلا example.com)", type: "text" },
          {
            name: "status",
            label: "وضعیت",
            type: "select",
            options: [
              { value: "active", label: "فعال" },
              { value: "inactive", label: "غیرفعال" },
            ],
          },
        ]}
      />
    </div>
  );
}
