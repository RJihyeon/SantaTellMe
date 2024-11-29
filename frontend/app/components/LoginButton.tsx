// components/LoginButton.js

import React from 'react';

const LoginButton = () => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://0.0.0.0:8000/login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);

      if (response.ok) {
        const result = await response.json();
        alert('Login successful: ' + JSON.stringify(result));

        // Redirect to /
        window.location.replace('/');
      } else {
        const error = await response.json();
        alert('Login failed: ' + error.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        // Handle error of type Error
        alert('An error occurred: ' + err.message);
      } else {
        // Handle unexpected error types
        console.error('Unexpected error:', err);
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <button
      id="fetchButton"
      onClick={fetchData}
      className="px-4 py-2 border-red-300 bg-red-600 border-2 rounded-full hover:bg-gray-200 transition-colors text-white font-extrabold"
    >
      로그인
    </button>
  );
};

export default LoginButton;