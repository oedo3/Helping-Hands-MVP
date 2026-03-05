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
          background:
            "linear-gradient(160deg, #7C68EE 0%, #C850F0 30%, #FF6060 58%, #FF8C00 82%)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21C12 21 3 14.5 3 8.5C3 6 4.8 4 7 4C8.7 4 10.1 5 11 6.5C11.9 5 13.3 4 15 4C17.2 4 19 6 19 8.5C19 14.5 12 21 12 21Z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
