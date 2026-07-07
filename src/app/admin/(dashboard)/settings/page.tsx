import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSetting } from "@/lib/db";

export default function AdminSettingsPage() {
  const token = getSetting("bale_bot_token") ?? "";

  return (
    <div>
      <AdminPageHeader title="تنظیمات" description="اتصال ربات بله و تغییر رمز عبور پنل مدیریت." />
      <SettingsForm
        initialSettings={{
          baleBotTokenSet: token.length > 0,
          baleBotTokenPreview: token ? `${token.slice(0, 6)}••••${token.slice(-4)}` : "",
          baleChatId: getSetting("bale_chat_id") ?? "",
        }}
      />
    </div>
  );
}
