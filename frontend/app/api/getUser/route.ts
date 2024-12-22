import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  nickname: string;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  console.log("Cookie header:", cookieHeader);
  if (!cookieHeader) {
    return NextResponse.json({ user: null });
  }

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  const token = cookies["access_token"];

  console.log("Cookie Header:", cookieHeader);
  console.log("Parsed Cookies:", cookies);
  console.log("Access Token:", token);
  console.log("JWT Secret:", process.env.JWT_SECRET);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as User;
      return NextResponse.json({ user: decoded });
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return NextResponse.json({ user: null });
}
