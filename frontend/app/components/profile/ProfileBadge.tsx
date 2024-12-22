"use client";

import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
}

const ProfileBadge: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/getFullUser", { method: "GET" });
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-4 h-full">
      <h3 className="hidden">Profile badge</h3>
      <div className="p-4 bg-gradient-to-br from-red-400 to-slate-200 rounded-lg lg:w-[40vh] h-full">
        <div className="w-[150px]">
          <img
            src="https://placehold.co/150x150"
            alt="Avatar"
            className="rounded-full border-spacing-2 border-white border-4 w-[150px]"
          />
        </div>
        <div className="flex flex-col place-content-between p-4">
          <span>
            <strong>Name:</strong> {user.name}
          </span>
          <span>
            <strong>Nickname:</strong> {user.nickname}
          </span>
          <span>
            <strong>Email:</strong> {user.email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;