"use client";

import React, { useEffect, useState } from "react";
import { useProfile } from "../ProfileContext";

const ProfileBadge = () => {
  const { username, nickname, setNickname, setUsername } = useProfile();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch profile.");
          return;
        }

        const data = await response.json();
        setNickname(data.nickname);
        setUsername(data.username);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setNickname]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mx-4 h-full">
      <h3 className="hidden">Profile badge</h3>
      <div className="p-4 bg-gradient-to-br from-red-400 to-slate-200 rounded-lg lg:w-[40vh] h-full">
        <div className="w-[150px]">
          <img
            src="/profile.webp"
            alt="Avatar"
            className="rounded-full border-spacing-2 border-white border-4 w-[150px]"
          />
        </div>
        <div className="flex flex-col place-content-between p-4">
          <span>
            <strong>Username:</strong> {username}
          </span>
          <span>
            <strong>Nickname:</strong>{" "}
            {nickname || "No nickname set. No hint provided."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;
