import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    console.error("No access token provided in cookies.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Sending request to FastAPI...");
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/voices`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

    // 데이터가 비었을 때 예외 처리
    if (
      (!data.received || data.received.length === 0) &&
      (!data.sent || data.sent.length === 0)
    ) {
      return NextResponse.json(
        { message: "메일함이 비었습니다", received: [], sent: [] },
        { status: 200 }
      );
    }

    // 데이터 그대로 전달
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching inbox data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
