import dotenv from "dotenv";
dotenv.config();

console.log("NEXT_PUBLIC_API_EXTERNAL_BASE_URL:", process.env.NEXT_PUBLIC_API_EXTERNAL_BASE_URL);

const login = async () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_EXTERNAL_BASE_URL}/login`;
};

export default login;
