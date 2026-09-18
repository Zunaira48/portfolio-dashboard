import { ImageResponse } from "next/og";

export const alt = "Zunaira Zahid — Software Engineer & QA Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0f",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c6cf6, #8f81ff)",
            color: "white",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          ZZ
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#f2f2f5", marginBottom: 20 }}>
          Zunaira Zahid
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#9a9aa5", marginBottom: 30 }}>
          Software Engineer &amp; QA Engineer
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#7c6cf6" }}>
          Full-stack development · AI Integration · Quality Assurance
        </div>
      </div>
    ),
    { ...size }
  );
}