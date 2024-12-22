import dotenv from "dotenv";
dotenv.config();

const login = async () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;
};

export default login;
