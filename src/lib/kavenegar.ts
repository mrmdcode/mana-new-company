type KavenegarResponse = {
  return?: { status?: number; message?: string };
};

export async function sendSms(apiKey: string, receptor: string, message: string): Promise<void> {
  const url = new URL(`https://api.kavenegar.com/v1/${apiKey}/sms/send.json`);
  url.searchParams.set("receptor", receptor);
  url.searchParams.set("message", message);

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10_000) });
  const body = (await res.json().catch(() => null)) as KavenegarResponse | null;

  if (!res.ok || body?.return?.status !== 200) {
    throw new Error(body?.return?.message ?? `Kavenegar API error ${res.status}`);
  }
}
