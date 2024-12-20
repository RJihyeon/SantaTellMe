"use client";
// components/LoginButton.js

import React from 'react';
// import fetchData from '../api/login';

const LoginButton = () => {
  const handleLogin = () => {
    // Redirect the user to the FastAPI login endpoint
    window.location.href = "http://localhost:8000/login";
  };
  
  return (
    <button
      id="fetchButton"
      onClick={handleLogin}
      className="px-4 py-2 border-red-300 bg-red-600 border-2 rounded-full hover:bg-gray-200 transition-colors text-white font-extrabold"
    >
      로그인
    </button>
  );
};

export default LoginButton;