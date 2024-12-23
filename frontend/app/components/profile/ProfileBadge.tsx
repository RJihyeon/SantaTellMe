"use client";

import React, { useEffect, useState } from "react";

const ProfileBadge = () => {
  const [profile, setProfile] = useState<{
    username: string;
    nickname: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch profile.");
          return;
        }

        const data = await response.json();
        setProfile(data); // username, nickname 데이터를 상태에 저장
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
            src="/santa.png"
            alt="Avatar"
            className="rounded-full border-spacing-2 border-white border-4 w-[150px]"
          />
        </div>
        <div className="flex flex-col place-content-between p-4">
          <span>
            <strong>Username:</strong> {profile?.username}
          </span>
          <span>
            <strong>Nickname:</strong> {profile?.nickname}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;
