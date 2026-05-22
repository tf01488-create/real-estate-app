import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 3,
          padding: "5px 5px 5px 5px",
        }}
      >
        {/* 棒グラフの棒：左から短・中・高 */}
        <div
          style={{
            width: 5,
            height: 10,
            background: "#93c5fd",
            borderRadius: "2px 2px 0 0",
          }}
        />
        <div
          style={{
            width: 5,
            height: 15,
            background: "#60a5fa",
            borderRadius: "2px 2px 0 0",
          }}
        />
        <div
          style={{
            width: 5,
            height: 18,
            background: "#ffffff",
            borderRadius: "2px 2px 0 0",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
