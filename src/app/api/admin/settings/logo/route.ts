import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { clearSiteLogo, getSiteLogo, setSiteLogo } from "@/lib/db";

const MAX_DATA_URL_LENGTH = 700_000; // ~500KB decoded
const ALLOWED_LOGO_PATTERN = /^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,/;

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ logo: getSiteLogo() ?? null });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as { logo?: string } | null;
  const dataUrl = body?.logo ?? "";

  if (!ALLOWED_LOGO_PATTERN.test(dataUrl)) {
    return NextResponse.json(
      { error: "فایل باید تصویر معتبر (PNG، JPG، WEBP یا SVG) باشد." },
      { status: 400 }
    );
  }

  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json({ error: "حجم لوگو باید کمتر از ۵۰۰ کیلوبایت باشد." }, { status: 400 });
  }

  setSiteLogo(dataUrl);
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  clearSiteLogo();
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
