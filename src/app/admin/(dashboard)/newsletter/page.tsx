import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SubscribersTable from "@/components/admin/SubscribersTable";
import { countSubscribers, listSubscribers } from "@/lib/db";

export default function AdminNewsletterPage() {
  const items = listSubscribers();

  return (
    <div>
      <AdminPageHeader
        title="مشترکین خبرنامه"
        description={`تعداد کل مشترکین: ${countSubscribers()} نفر — شماره موبایل‌هایی که از فرم عضویت خبرنامه در صفحه اصلی ثبت شده‌اند.`}
      />
      <SubscribersTable initialItems={items} />
    </div>
  );
}
