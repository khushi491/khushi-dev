import { ImageResponse } from "next/og";

export const alt = "Khushi Parmar, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0f0e",
          color: "#e4d8be",
          padding: "72px 80px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c4a56a",
          }}
        >
          <span>Software engineer</span>
          <span>New York, NY</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 128,
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
          >
            Khushi
          </div>
          <div
            style={{
              fontSize: 128,
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              fontStyle: "italic",
              color: "#c4a56a",
            }}
          >
            Parmar
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 28,
              color: "#a39b88",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            I build backend systems and full stack products, and I work with applied AI.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
