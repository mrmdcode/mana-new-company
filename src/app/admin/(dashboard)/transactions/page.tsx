import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TransactionsTable from "@/components/admin/TransactionsTable";
import { listTransactions } from "@/lib/db";

export default function AdminTransactionsPage() {
  const items = listTransactions();

  return (
    <div>
      <AdminPageHeader
        title="تراکنش‌ها"
        description="سوابق پرداخت‌های واقعی که از طریق زرین‌پال انجام شده‌اند. تایید هر تراکنش خودکار و توسط زرین‌پال انجام می‌شود."
      />
      <TransactionsTable initialItems={items} />
    </div>
  );
}
