"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import login from "../api/login";

interface User {
  id: string;
  nickname: string;
}

const LoginButton: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/getUser", { method: "GET" });
        const data = await response.json();
        console.log("Fetched user:", data.user);
        if (data.user) {
          setUser(data.user); // Update the user state
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []); // Run once on component mount

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "GET" }); // Call the logout API
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleStart = () => {
    // Redirect to your login endpoint
    window.location.href = "/send";
  };

  return (
    <>
      {user ? (
        <>
          <button
            id="logoutButton"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            로그아웃
          </button>
          <button
            id="sendButton"
            onClick={handleStart}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            시작하기
          </button>
        </>
      ) : (
        <div onClick={handleLogin} className="cursor-pointer">
          <Image
            src="/oauth/kakao_login_medium_narrow.png"
            alt="로그인"
            width={200} // Adjust as needed
            height={50} // Adjust as needed
            className="hover:opacity-80 transition-opacity"
          />
        </div>
      )}
    </>
  );
};

export default LoginButton;
