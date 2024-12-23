import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const voiceId = req.nextUrl.searchParams.get("voice_id");

  if (!token) {
    console.error("No access token provided in cookies.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!voiceId) {
    console.error("Missing voice_id in query parameters.");
    return NextResponse.json(
      { message: "Bad Request: voice_id is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    console.log("Request body to forward:", body);
    console.log("Voice ID:", voiceId);

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/guess?voice_id=${voiceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error("Error from FastAPI:", errorData);
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    console.log("Response received from FastAPI:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error during guess request forwarding:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
