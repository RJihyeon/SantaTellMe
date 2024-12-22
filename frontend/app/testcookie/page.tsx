"use client"
// pages/test-cookie.js

import React, { useState, useEffect } from 'react';

const TestCookiePage = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // HttpOnly cookie test
    fetch('http://0.0.0.0:8000/protected-data', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unauthorized or invalid token');
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message); // Update the message with the server response
      })
      .catch((err) => {
        console.error(err);
        setMessage('쿠키를 읽는 데 실패했거나 인증되지 않았습니다.');
      });
  }, []);

  return (
    <div>
      <h1>쿠키 테스트</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestCookiePage;