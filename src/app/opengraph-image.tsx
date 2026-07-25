import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadVazirmatn(weight: 400 | 700) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Vazirmatn:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, {
    headers: {
      // Google serves woff2 (unsupported by satori) unless the UA looks legacy enough for ttf
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0",
    },
  }).then((res) => res.text());

  const match = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/.exec(css);
  if (!match) throw new Error("Vazirmatn font URL not found");

  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

export default async function Image() {
  const [regular, bold] = await Promise.all([loadVazirmatn(400), loadVazirmatn(700)]);
  // satori doesn't shape ZWNJ (نیم‌فاصله) correctly within a bidi run, so use a
  // plain space here only — the real site still renders the ZWNJ normally.
  const tagline = siteConfig.tagline.replace(/‌/g, " ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #05070d 0%, #0f172a 55%, #05070d 100%)",
          fontFamily: "Vazirmatn",
          direction: "rtl",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 120,
            width: 120,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #2dd4bf, #0891b2)",
            marginBottom: 40,
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.5 20 6v6c0 5.2-3.4 8.9-8 10.5-4.6-1.6-8-5.3-8-10.5V6l8-3.5Z"
              fill="white"
              fillOpacity="0.35"
            />
            <path d="M12 6.5 17 8.8v3.3c0 3.4-2 5.9-5 7.1-3-1.2-5-3.7-5-7.1V8.8L12 6.5Z" fill="white" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            marginBottom: 18,
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#5eead4", fontWeight: 400 }}>
          {tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Vazirmatn", data: regular, weight: 400, style: "normal" },
        { name: "Vazirmatn", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
