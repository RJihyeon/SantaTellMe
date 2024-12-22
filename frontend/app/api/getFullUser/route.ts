import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  nickname: string;
  kakao_id: string;
  username: string;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return NextResponse.json({ user: null });
  }

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  const token = cookies["access_token"];
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    // Decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };

    // Fetch full user info from backend
    const userId = decoded.id;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user details from backend");
      return NextResponse.json({ user: null });
    }

    const userData: User = await response.json();

    // Return user data
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Invalid token or error fetching user details:", error);
    return NextResponse.json({ user: null });
  }
}