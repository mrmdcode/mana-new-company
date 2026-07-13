function baseUrl(sandbox: boolean): string {
  return sandbox ? "https://sandbox.zarinpal.com" : "https://payment.zarinpal.com";
}

export function zarinpalStartPayUrl(sandbox: boolean, authority: string): string {
  return `${baseUrl(sandbox)}/pg/StartPay/${authority}`;
}

type ZarinpalApiResponse<T> = {
  data: T | Record<string, never>;
  errors: unknown[] | Record<string, unknown>;
};

async function callZarinpal<T>(sandbox: boolean, path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${baseUrl(sandbox)}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });

  const json = (await res.json().catch(() => null)) as ZarinpalApiResponse<T> | null;
  if (!json || !json.data || Array.isArray(json.data) || Object.keys(json.data).length === 0) {
    const errorMessage =
      json && !Array.isArray(json.errors) && "message" in json.errors
        ? String((json.errors as { message?: unknown }).message)
        : `پاسخ نامعتبر از زرین‌پال (HTTP ${res.status})`;
    throw new Error(errorMessage);
  }

  return json.data as T;
}

export async function zarinpalRequestPayment(params: {
  merchantId: string;
  sandbox: boolean;
  amount: number;
  description: string;
  callbackUrl: string;
  mobile?: string;
}): Promise<{ authority: string; payUrl: string }> {
  const data = await callZarinpal<{ code: number; message: string; authority: string }>(
    params.sandbox,
    "/pg/v4/payment/request.json",
    {
      merchant_id: params.merchantId,
      amount: params.amount,
      currency: "IRT",
      description: params.description,
      callback_url: params.callbackUrl,
      metadata: params.mobile ? { mobile: params.mobile } : undefined,
    }
  );

  if (data.code !== 100) {
    throw new Error(data.message || `درخواست پرداخت زرین‌پال رد شد (کد ${data.code})`);
  }

  return { authority: data.authority, payUrl: zarinpalStartPayUrl(params.sandbox, data.authority) };
}

export async function zarinpalVerifyPayment(params: {
  merchantId: string;
  sandbox: boolean;
  amount: number;
  authority: string;
}): Promise<{ success: boolean; code: number; message: string; refId?: string; cardPan?: string }> {
  const data = await callZarinpal<{
    code: number;
    message: string;
    ref_id?: number | string;
    card_pan?: string;
  }>(params.sandbox, "/pg/v4/payment/verify.json", {
    merchant_id: params.merchantId,
    amount: params.amount,
    authority: params.authority,
  });

  // 100: verified now. 101: already verified in an earlier call. Both mean paid.
  const success = data.code === 100 || data.code === 101;
  return {
    success,
    code: data.code,
    message: data.message,
    refId: data.ref_id != null ? String(data.ref_id) : undefined,
    cardPan: data.card_pan,
  };
}
