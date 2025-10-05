import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "IRM Ministries";
    const subtitle =
      searchParams.get("subtitle") || "Faith, Community & Servant Leadership";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1a1a",
            backgroundImage:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              maxWidth: "900px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "32px",
                color: "rgba(255,255,255,0.9)",
                fontWeight: "400",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Cross Icon */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              fontSize: "48px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            ✝
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : "Unknown error";
    return new Response(`Failed to generate the image: ${error}`, {
      status: 500,
    });
  }
}
