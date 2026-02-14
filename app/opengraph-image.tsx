import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Hot 100 AI — The Canonical Index of AI Agents, MCP Servers & Agentic Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1814 0%, #2d2820 50%, #1a1814 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px 80px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "999px",
            padding: "8px 20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#C8956C",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}>
            The canonical index of AI tools
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#FFFAF5",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-1px",
          }}
        >
          Hot 100 AI
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            marginTop: "20px",
            lineHeight: 1.4,
            maxWidth: "700px",
          }}
        >
          Discover, compare, and choose the right AI agents, MCP servers & agentic tools
        </div>

        {/* Domain */}
        <div
          style={{
            fontSize: "22px",
            color: "#C8956C",
            marginTop: "40px",
            fontWeight: 600,
          }}
        >
          hot100ai.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
