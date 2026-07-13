import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import LogoUploadForm from "@/components/admin/LogoUploadForm";
import SmsSettingsForm from "@/components/admin/SmsSettingsForm";
import ZarinpalSettingsForm from "@/components/admin/ZarinpalSettingsForm";
import { getKavenegarConfig, getSetting, getSiteLogo, getZarinpalConfig } from "@/lib/db";
import { DEFAULT_CONTACT_SMS_TEMPLATE, DEFAULT_NEWSLETTER_SMS_TEMPLATE } from "@/data/sms-templates";

export default function AdminSettingsPage() {
  const token = getSetting("bale_bot_token") ?? "";
  const { apiKey: smsKey, sender: smsSender, apiKeySource } = getKavenegarConfig();
  const { merchantId: zarinpalMerchantId, sandbox: zarinpalSandbox } = getZarinpalConfig();

  return (
    <div>
      <AdminPageHeader
        title="تنظیمات"
        description="لوگوی سایت، اتصال ربات بله، پیامک خودکار و تغییر رمز عبور پنل مدیریت."
      />

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

      <div className="mt-6">
        <SmsSettingsForm
          initialSettings={{
            apiKeySet: Boolean(smsKey),
            apiKeyPreview: smsKey ? `${smsKey.slice(0, 4)}••••${smsKey.slice(-4)}` : "",
            apiKeySource,
            sender: smsSender ?? "",
            contactTemplate: getSetting("sms_contact_template") || DEFAULT_CONTACT_SMS_TEMPLATE,
            newsletterTemplate: getSetting("sms_newsletter_template") || DEFAULT_NEWSLETTER_SMS_TEMPLATE,
          }}
        />
      </div>

      <div className="mt-6">
        <ZarinpalSettingsForm
          initialSettings={{
            merchantIdSet: Boolean(zarinpalMerchantId),
            merchantIdPreview: zarinpalMerchantId
              ? `${zarinpalMerchantId.slice(0, 6)}••••${zarinpalMerchantId.slice(-4)}`
              : "",
            sandbox: zarinpalSandbox,
          }}
        />
      </div>
    </div>
  );
}
