import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MessagesList from "@/components/admin/MessagesList";
import { listMessages } from "@/lib/db";

export default function AdminMessagesPage() {
  const items = listMessages();

  return (
    <div>
      <AdminPageHeader
        title="پیام‌های تماس"
        description="پیام‌هایی که کاربران از فرم «تماس با ما» ارسال کرده‌اند."
      />
      <MessagesList initialItems={items} />
    </div>
  );
}
