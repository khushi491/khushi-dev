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
          background: "#0e0f0e",
          color: "#c4a56a",
          fontSize: 72,
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "-0.06em",
        }}
      >
        KP
      </div>
    ),
    { ...size },
  );
}
