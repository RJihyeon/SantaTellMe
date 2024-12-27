// contexts/ProfileContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface ProfileContextType {
  username: string;
  nickname: string;
  setUsername: (username: string) => void;
  setNickname: (nickname: string) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  return (
    <ProfileContext.Provider
      value={{ username, nickname, setNickname, setUsername }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
