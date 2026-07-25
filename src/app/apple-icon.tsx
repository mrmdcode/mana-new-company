import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2dd4bf, #0891b2)",
          borderRadius: 40,
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.5 20 6v6c0 5.2-3.4 8.9-8 10.5-4.6-1.6-8-5.3-8-10.5V6l8-3.5Z"
            fill="white"
            fillOpacity="0.35"
          />
          <path d="M12 6.5 17 8.8v3.3c0 3.4-2 5.9-5 7.1-3-1.2-5-3.7-5-7.1V8.8L12 6.5Z" fill="white" />
        </svg>
      </div>
    ),
    size
  );
}
