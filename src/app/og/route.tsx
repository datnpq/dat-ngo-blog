import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "dat.ngo";
  const subtitle = searchParams.get("subtitle") ?? "Nguyễn Phạm Quốc Đạt";
  const tags = searchParams.get("tags") ?? "";

  const tagList = tags ? tags.split(",").slice(0, 3) : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FAFAF8",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "64px",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2563EB, #7C3AED)",
          }}
        />

        {/* Avatar */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "700",
            color: "white",
            marginBottom: "40px",
          }}
        >
          ĐN
        </div>

        {/* Tag pills */}
        {tagList.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {tagList.map((tag) => (
              <div
                key={tag}
                style={{
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: "100px",
                  padding: "4px 14px",
                  fontSize: "13px",
                  color: "#2563EB",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {tag.trim()}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 50 ? "38px" : "48px",
            fontWeight: "800",
            color: "#111111",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
            flex: 1,
          }}
        >
          {title}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #E9E9E9",
            paddingTop: "28px",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#111111" }}>
              {subtitle}
            </div>
            <div style={{ fontSize: "13px", color: "#6B7280" }}>
              Co-Founder @ REALITECH · Founder @ WeDev
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#2563EB",
              letterSpacing: "-0.03em",
            }}
          >
            dat.ngo
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
