import { getSiteLogo } from "@/lib/db";
import { parseDataUrl } from "@/lib/data-url";

export const dynamic = "force-dynamic";

const DEFAULT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#0d9488"/>
  <path d="M32 10L50 17V30C50 41.5 42.6 49.7 32 54C21.4 49.7 14 41.5 14 30V17L32 10Z" fill="#e7fbf8"/>
  <path d="M32 17L43 21.3V29.8C43 37.4 38.4 42.8 32 45.6C25.6 42.8 21 37.4 21 29.8V21.3L32 17Z" fill="#0d9488"/>
  <circle cx="32" cy="30" r="5.5" fill="#e7fbf8"/>
  <path d="M32 34.5V39" stroke="#e7fbf8" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// Favicon mirrors whatever logo is set from the admin settings page, falling
// back to the default mark; force-dynamic so it never gets stuck on a stale
// build-time render once an admin uploads or removes a logo.
export default async function icon() {
  const logo = getSiteLogo();
  const blob = logo ? parseDataUrl(logo) : null;

  if (blob) {
    return new Response(blob, { headers: { "Cache-Control": "no-store" } });
  }

  return new Response(DEFAULT_ICON_SVG, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" },
  });
}
