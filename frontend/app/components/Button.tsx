// components/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isBrowser?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
  // In a Next.js environment, you can check if the code is running on the client side
  const isBrowser = typeof window !== 'undefined';

  return (
    <button
      {...props}
      disabled={!isBrowser || props.disabled}
      className="px-4 py-2 border-red-300 bg-red-600 border-2 rounded-full hover:bg-gray-200 transition-colors text-white font-extrabold"
    />
  );
};