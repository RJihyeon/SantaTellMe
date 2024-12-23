import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // 클라이언트로부터 JSON 데이터를 파싱
    const { id } = body; // 메시지 ID 가져오기

    if (!id) {
      return NextResponse.json(
        { detail: "Message ID is required." },
        { status: 400 }
      );
    }

    // FastAPI로 요청 전달
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/mark-read`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error("[DEBUG] Backend Error:", errorData);
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    console.log("[DEBUG] Successfully updated is_read:", data);

    // FastAPI 응답 반환
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[DEBUG] Error in mark-read API route:", error);
    return NextResponse.json(
      { detail: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
