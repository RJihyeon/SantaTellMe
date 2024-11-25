import { h } from "preact";
import { useSignal } from "@preact/signals";

export default function TestCookiePage() {
  const message = useSignal<string>("Loading...");

    // HttpOnly 쿠키 테스트
    fetch("http://0.0.0.0:8000/protected-data", {
      method: "GET",
      credentials: "include", // 쿠키 포함 요청
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or invalid token");
        }
        return res.json();
      })
      .then((data) => {
        message.value = data.message; // 서버의 응답 메시지 업데이트
      })
      .catch((err) => {
        console.error(err);
        message.value = "쿠키를 읽는 데 실패했거나 인증되지 않았습니다.";
      });
  return (
    <div>
      <h1>쿠키 테스트</h1>
      <h1>쿠키 테스트</h1>
      <h1>쿠키 테스트</h1>
      <h1>쿠키 테스트</h1>
      <h1>쿠키 테스트</h1>
      <p>{message.value}</p>
      <p>{message.value}</p>
      <p>{message.value}</p>
      <p>{message.value}</p>
      <p>{message.value}</p>
      <p>{message.value}</p>
      <p>{message.value}</p>
      <p>{message.value}</p>
      <p>{message.value}</p>
    </div>
  );
}