import { NextResponse, NextRequest } from "next/server";
import { getJwt } from "@/app/lib/auth_jwt";

export async function GET(req: NextRequest) {
  const { token, error } = getJwt(req);

  if (error || !token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { detail: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}
