import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getJwt, verifyJwt } from "@/app/lib/auth_jwt";

export async function GET(request: Request) {
  const { token, user, error } = getJwt(request);
  if (error) NextResponse.json({ user: null });

  return NextResponse.json({ user });
}