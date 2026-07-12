import { NextResponse } from "next/server";
import { getTransactionByAuthority, setTransactionTrackingNote } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const authority = body?.authority?.trim();
  const trackingNote = typeof body?.tracking_note === "string" ? body.tracking_note.slice(0, 200) : "";

  if (!authority) {
    return NextResponse.json({ error: "authority الزامی است." }, { status: 400 });
  }

  const transaction = getTransactionByAuthority(authority);
  if (!transaction) {
    return NextResponse.json({ error: "تراکنش یافت نشد." }, { status: 404 });
  }
  if (transaction.status !== "pending") {
    return NextResponse.json({ error: "این تراکنش قبلا نهایی شده است." }, { status: 409 });
  }

  setTransactionTrackingNote(authority, trackingNote);
  return NextResponse.json({ success: true });
}
