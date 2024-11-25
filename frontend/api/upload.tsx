
const BASE_URL="http://0.0.0.0:8000"
const AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxfQ.J8Qj4p5xrAMj0GKjddGky-oeAOlWxjT8KOCisXzSOdU"


export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("audio_file", file); // 필드 이름을 FastAPI와 동일하게 설정

    //임시지정, 수정해야함(아마도 url에서 뽑는 방식)
    const toUserId=1;

  
    // `to_user_id`를 URL의 쿼리 파라미터로 추가
    const url = `${BASE_URL}/voice?to_user_id=${toUserId}`;
  
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
          `Failed to upload file: HTTP ${response.status}, ${errorText}`
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