import { NextResponse, NextRequest } from "next/server";
import { getJwt } from "@/app/lib/auth_jwt";

export async function GET(request: NextRequest) {
  const { token, user, error } = getJwt(request);
  if (error) return NextResponse.json({ user: null });

  try {
    console.log("Sending request to FastAPI...");
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/voices`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("FastAPI Response Status:", backendResponse.status);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error("Error from FastAPI:", errorData);
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    console.log("Data received from FastAPI:", data);

    // FastAPI가 "No voices found" 메시지를 보낼 때 처리
    if (data.message === "No voices found") {
      return NextResponse.json(
        { message: "메일함이 비었습니다", received: [], sent: [] },
        { status: 200 }
      );
    }

    // 받은 데이터에 대해 검사
    if (
      (!data.received || data.received.length === 0) &&
      (!data.sent || data.sent.length === 0)
    ) {
      return NextResponse.json(
        { message: "메일함이 비었습니다", received: [], sent: [] },
        { status: 200 }
      );
    }

    // 데이터가 있는 경우 그대로 반환
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching inbox data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
