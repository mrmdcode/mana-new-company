import { NextResponse } from "next/server";
import { getTransactionByAuthority, getZarinpalConfig, markTransactionResult } from "@/lib/db";
import { zarinpalVerifyPayment } from "@/lib/zarinpal";
import { fireCallbackWebhook } from "@/lib/webhook";

function buildReturnUrl(callbackUrl: string, authority: string, status: "paid" | "failed", refId?: string | null) {
  try {
    const url = new URL(callbackUrl);
    url.searchParams.set("authority", authority);
    url.searchParams.set("status", status);
    if (refId) url.searchParams.set("ref_id", refId);
    return url.toString();
  } catch {
    return callbackUrl;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authority = url.searchParams.get("Authority");
  const zarinpalStatus = url.searchParams.get("Status");

  if (!authority) {
    return NextResponse.json({ error: "Authority یافت نشد." }, { status: 400 });
  }

  const transaction = getTransactionByAuthority(authority);
  if (!transaction) {
    return NextResponse.json({ error: "تراکنش یافت نشد." }, { status: 404 });
  }

  // Zarinpal may redirect back more than once for the same authority; only
  // act the first time, then just replay the already-decided result.
  if (transaction.status !== "pending") {
    return NextResponse.redirect(
      buildReturnUrl(transaction.callback_url, transaction.authority, transaction.status, transaction.ref_id)
    );
  }

  if (zarinpalStatus !== "OK") {
    markTransactionResult(authority, { status: "failed" });
    return NextResponse.redirect(buildReturnUrl(transaction.callback_url, authority, "failed"));
  }

  const zarinpal = getZarinpalConfig();
  if (!zarinpal.merchantId) {
    markTransactionResult(authority, { status: "failed" });
    return NextResponse.redirect(buildReturnUrl(transaction.callback_url, authority, "failed"));
  }

  let verifyResult;
  try {
    verifyResult = await zarinpalVerifyPayment({
      merchantId: zarinpal.merchantId,
      sandbox: zarinpal.sandbox,
      amount: transaction.amount,
      authority,
    });
  } catch {
    verifyResult = { success: false, code: 0, message: "" };
  }

  const finalStatus = verifyResult.success ? "paid" : "failed";
  const updated = markTransactionResult(authority, {
    status: finalStatus,
    refId: verifyResult.success ? verifyResult.refId : undefined,
    cardPan: verifyResult.success ? verifyResult.cardPan : undefined,
  });

  const returnUrl = buildReturnUrl(transaction.callback_url, authority, finalStatus, updated?.ref_id);

  fireCallbackWebhook(transaction.callback_url, {
    authority,
    status: finalStatus,
    amount: transaction.amount,
    ref_id: updated?.ref_id ?? null,
  });

  return NextResponse.redirect(returnUrl);
}
