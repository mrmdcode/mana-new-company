import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TransactionsTable from "@/components/admin/TransactionsTable";
import { listTransactions } from "@/lib/db";

export default function AdminTransactionsPage() {
  const items = listTransactions();

  return (
    <div>
      <AdminPageHeader
        title="تراکنش‌ها"
        description="پرداخت‌های کارت‌به‌کارت در انتظار بررسی. پس از چک کردن واریزی در حساب بانکی خودتان، پرداخت را تایید یا رد کنید."
      />
      <TransactionsTable initialItems={items} />
    </div>
  );
}
