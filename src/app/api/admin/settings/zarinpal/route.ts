import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getZarinpalConfig, setZarinpalConfig } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { merchantId, sandbox } = getZarinpalConfig();
  return NextResponse.json({
    merchantIdSet: Boolean(merchantId),
    merchantIdPreview: merchantId ? `${merchantId.slice(0, 6)}••••${merchantId.slice(-4)}` : "",
    sandbox,
  });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as
    | { merchantId?: string; sandbox?: boolean }
    | null;

  setZarinpalConfig({
    merchantId: body?.merchantId,
    sandbox: body?.sandbox !== false,
  });

  return NextResponse.json({ success: true });
}
