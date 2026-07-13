import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EntityManager from "@/components/admin/EntityManager";
import { listDomains, listGateways, type PaymentGatewayWithDomainRow } from "@/lib/db";

export default function AdminGatewaysPage() {
  const items = listGateways();
  const domains = listDomains();

  return (
    <div>
      <AdminPageHeader
        title="درگاه‌ها"
        description="فعال کردن merchantID یک دامنه بعنوان درگاه پرداخت. تمام درگاه‌های فعال از حساب زرین‌پال شما (تنظیمات) برای پرداخت واقعی استفاده می‌کنند."
      />

      <EntityManager<PaymentGatewayWithDomainRow>
        apiBase="/api/admin/gateways"
        addLabel="افزودن درگاه"
        emptyLabel="هنوز درگاهی ثبت نشده است."
        initialItems={items}
        columns={[
          { key: "domain_name", label: "کسب‌وکار" },
          { key: "merchant_id", label: "merchantID" },
          { key: "status", label: "وضعیت" },
        ]}
        fields={[
          {
            name: "domain_id",
            label: "دامنه (merchantID)",
            type: "select",
            options: domains.map((d) => ({ value: String(d.id), label: `${d.name} — ${d.merchant_id}` })),
          },
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
