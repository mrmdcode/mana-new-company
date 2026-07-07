import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createPartner, listPartners } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ items: listPartners() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!body?.name?.trim() || !body?.field?.trim()) {
    return NextResponse.json({ error: "نام و حوزه فعالیت الزامی است." }, { status: 400 });
  }

  const item = createPartner({ name: body.name, field: body.field });
  revalidatePath("/");
  return NextResponse.json({ item }, { status: 201 });
}
