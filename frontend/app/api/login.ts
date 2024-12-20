import dotenv from "dotenv";
dotenv.config();

console.log("API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const login = async () => {
  window.location.href = "http://localhost:8000/login";
};

export default login;
