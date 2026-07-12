export async function fireCallbackWebhook(
  callbackUrl: string,
  payload: Record<string, unknown>
): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    console.error(`[webhook] ارسال به ${callbackUrl} ناموفق بود:`, error);
  } finally {
    clearTimeout(timeout);
  }
}
