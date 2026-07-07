import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import LogoUploadForm from "@/components/admin/LogoUploadForm";
import { getSetting, getSiteLogo } from "@/lib/db";

export default function AdminSettingsPage() {
  const token = getSetting("bale_bot_token") ?? "";

  return (
    <div>
      <AdminPageHeader title="تنظیمات" description="لوگوی سایت، اتصال ربات بله و تغییر رمز عبور پنل مدیریت." />

      <div className="mb-6">
        <LogoUploadForm initialLogo={getSiteLogo() ?? null} />
      </div>

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
