// pages/api/user/nickname.ts

import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value; // JWT 토큰 가져오기

  if (!token) {
    return NextResponse.json(
      { detail: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json(); // 클라이언트 요청의 본문 데이터
    const { nickname } = body;

    if (!nickname || nickname.length < 2 || nickname.length > 30) {
      return NextResponse.json(
        { detail: "닉네임은 3글자 이상 30글자 미만으로 작성해주세요." },
        { status: 400 }
      );
    }

    // 백엔드로 요청 전달
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/nickname`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[Middleware Error]:", error);
    return NextResponse.json(
      { detail: "An unexpected error occurred while processing the request." },
      { status: 500 }
    );
  }
}
