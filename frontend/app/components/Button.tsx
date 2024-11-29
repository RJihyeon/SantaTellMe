// components/Button.tsx
"use client";

import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} 
    className="px-4 py-2 border-red-300 bg-red-600 border-2 rounded-full hover:bg-gray-200 transition-colors text-white font-extrabold">
      {children}
    </button>
  );
};

export default Button;