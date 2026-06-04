import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/data";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#050507",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(239,68,68,0.30), transparent 55%), radial-gradient(circle at 80% 80%, rgba(220,38,38,0.20), transparent 55%)",
          color: "#f5f5f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              backgroundColor: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "#ef4444",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            SS
          </div>
          <span
            style={{
              fontSize: "26px",
              color: "#a1a1aa",
            }}
          >
            sumeetshrestha.dev
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "28px",
              color: "#ef4444",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Full-Stack Developer
          </div>
          <div
            style={{
              fontSize: "108px",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Sumeet</span>
            <span style={{ color: "#ef4444" }}>Shrestha.</span>
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#a1a1aa",
              marginTop: "32px",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Real-time trading platforms, interactive charts, and full-stack apps.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "22px",
            color: "#71717a",
          }}
        >
          <span>Senior Developer @ NepseTrading</span>
          <span>Kathmandu, Nepal</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
