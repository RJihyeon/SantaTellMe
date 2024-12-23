import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyJwt } from "@/app/lib/auth_jwt";

export async function GET(request: Request) {
  const { user, error } = verifyJwt(request);
  if (error) NextResponse.json({ user: null });

  return user;
}