import { getJwt } from "@/app/lib/auth_jwt";
import { NextRequest, NextResponse } from "next/server";

// API handler for POST requests to generate an invite link
export async function POST(req: NextRequest) {
  const { token, user, error } = getJwt(req);
  if (error) NextResponse.json({ user: null });

  try {
    // Forward request to FastAPI backend with JWT as Bearer token
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/invitation`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send JWT in Authorization header
        },
      }
    );

    // If backend responds with success, return the invite link
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ url: data.url });
    } else {
      // Handle error responses from the backend
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.detail || "Failed to generate invite link" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error contacting backend:", error);
    // Return internal server error if fetch fails
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
