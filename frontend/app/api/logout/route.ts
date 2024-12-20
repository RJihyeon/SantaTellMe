import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0, // Immediately expire the cookie
    path: "/",
  });
  return response;
}