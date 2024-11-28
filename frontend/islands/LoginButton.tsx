import { h } from "preact";

export default function LoginButton() {
  const fetchData = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      if (response.ok) {
        const result = await response.json();
        alert("Login successful: " + JSON.stringify(result));

        // 리디렉션을 /로 수행
        window.location.replace("/");
      } else {
        const error = await response.json();
        alert("Login failed: " + error.message);
      }
    } catch (err) {
        if (err instanceof Error) {
          // err가 Error 타입인 경우 처리
          alert("An error occurred: " + err.message);
        } else {
          // 예상치 못한 타입의 에러 처리
          console.error("Unexpected error:", err);
          alert("An unexpected error occurred.");
        }}
  };

  return (
    <button
      id="fetchButton"
      onClick={fetchData}
      class="px-4 py-2 border-red-300 bg-red-600 border-2 rounded-full hover:bg-gray-200 transition-colors text-white font-extrabold" 
    >
      로그인
    </button>
  );
}