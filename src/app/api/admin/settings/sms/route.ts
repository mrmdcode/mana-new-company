import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getKavenegarConfig, getSetting, setSetting } from "@/lib/db";
import { DEFAULT_CONTACT_SMS_TEMPLATE, DEFAULT_NEWSLETTER_SMS_TEMPLATE } from "@/data/sms-templates";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { apiKey, sender, apiKeySource } = getKavenegarConfig();
  return NextResponse.json({
    apiKeySet: Boolean(apiKey),
    apiKeyPreview: apiKey ? `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}` : "",
    apiKeySource,
    sender: sender ?? "",
    contactTemplate: getSetting("sms_contact_template") || DEFAULT_CONTACT_SMS_TEMPLATE,
    newsletterTemplate: getSetting("sms_newsletter_template") || DEFAULT_NEWSLETTER_SMS_TEMPLATE,
  });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as
    | { apiKey?: string; sender?: string; contactTemplate?: string; newsletterTemplate?: string }
    | null;

  if (typeof body?.apiKey === "string" && body.apiKey.trim()) {
    setSetting("kavenegar_api_key", body.apiKey.trim());
  }
  if (typeof body?.sender === "string") {
    setSetting("kavenegar_sender", body.sender.trim());
  }
  if (typeof body?.contactTemplate === "string" && body.contactTemplate.trim()) {
    setSetting("sms_contact_template", body.contactTemplate.trim());
  }
  if (typeof body?.newsletterTemplate === "string" && body.newsletterTemplate.trim()) {
    setSetting("sms_newsletter_template", body.newsletterTemplate.trim());
  }

  return NextResponse.json({ success: true });
}
