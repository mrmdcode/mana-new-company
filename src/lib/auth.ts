import crypto from "node:crypto";
import { getSessionSecret } from "./db";

export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12; // ۱۲ ساعت

export function createSessionToken(): string {
  const expires = Date.now() + ADMIN_SESSION_TTL_MS;
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(String(expires)).digest("hex");
  return `${expires}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expected = crypto.createHmac("sha256", getSessionSecret()).update(expiresStr).digest("hex");
  const provided = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  return provided.length === expectedBuf.length && crypto.timingSafeEqual(provided, expectedBuf);
}
