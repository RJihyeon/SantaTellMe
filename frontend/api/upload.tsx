import { JSX } from "preact";
import "@std/dotenv/load"
import { HandlerContext } from "$fresh/server.ts";



// 핸들러: BASE_URL과 AUTH_TOKEN 반환
export const handler = (req: Request, ctx: HandlerContext) => {
  //여기 환경변수 불러오는 거 아직 연구중 ㅜㅜㅜㅜㅜ
  const BASE_URL ="http://0.0.0.0:8000"
  console.log(BASE_URL)
  const AUTH_TOKEN= "여기에 토큰 일단은 하드코딩으로 테스트 ㄱㄱ"
  console.log(AUTH_TOKEN)

  const responsePayload = {
    BASE_URL,
    AUTH_TOKEN,
  };

  return new Response(JSON.stringify(responsePayload), {
    headers: { "Content-Type": "application/json" },
  });
};



export async function uploadFile(file: File): Promise<string> {
  const tokenResponse = await fetch("/api/env"); // 환경변수 요청을 위한 엔드포인트
  if (!tokenResponse.ok) {
    throw new Error("Failed to retrieve environment variables from server.");
  }

  const { BASE_URL, AUTH_TOKEN } = await tokenResponse.json();
  
  
  const formData = new FormData();
    formData.append("audio_file", file); // 필드 이름을 FastAPI와 동일하게 설정

    //임시지정, 수정해야함(아마도 url에서 뽑는 방식)
    const toUserId=1;

  
    // `to_user_id`를 URL의 쿼리 파라미터로 추가
    const url = `${BASE_URL}/voice?to_user_id=${toUserId}`;
  
    console.log(url);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`, // 인증 토큰 추가
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload file: HTTP ${response.status}, ${errorText}
          `
        );
      }
  
      const result = await response.json();
      console.log("Upload result:", result);
      return result.message || "File uploaded successfully!";

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during upload.");
    }
  }