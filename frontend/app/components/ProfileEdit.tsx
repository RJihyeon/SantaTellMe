"use client";

import React, { useState } from "react";
import { useProfile } from "./ProfileContext";

const ProfileEdit: React.FC = () => {
  const { nickname, setNickname } = useProfile();
  const [newNickname, setNewNickname] = useState(nickname);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/nickname", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: newNickname }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);
        setMessage(
          `Error: ${errorData.detail || "Failed to update nickname."}`
        );
        return;
      }

      const data = await response.json();
      setNickname(data.nickname);
      setMessage(`Success: ${data.message}`);
    } catch (error) {
      console.error("Error updating nickname:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#e2e8f0",
          padding: "16px",
          borderRadius: "8px",
          width: "100%",
          alignContent: "center",
          height: "100%",
        }}
      >
        <div className="mb-4 ">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="border px-4 py-2 rounded-lg text-sm w-full"
            required
          />
        </div>

        <div className="mb-4 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 transition-colors"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && (
          <div
            className={`p-2 rounded-lg text-sm ${
              message.startsWith("Success")
                ? "text-green-600 bg-green-100"
                : "text-red-600 bg-red-100"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileEdit;
