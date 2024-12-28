import dotenv from "dotenv";
dotenv.config();

console.log("NEXT_PUBLIC_API_EXTERNAL_BASE_URL:", process.env.NEXT_PUBLIC_API_EXTERNAL_BASE_URL);

const login = async () => {
  const response = await fetch("/api/login");

  if (!response.ok) {
    const errorData = await response.json();
    console.error("[DEBUG] Fetch failed:", errorData);
    return;
  }

  const data = await response.json();

  window.location.href =  data.kakao_auth_url
};

export default login;
