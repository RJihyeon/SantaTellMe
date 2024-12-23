"use client";
// components/EditProfileForm.tsx

import React, { useState } from "react";

const ProfileEdit: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [message, setMessage] = useState<string | null>(null); // 상태 메시지
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      console.log("Submitting nickname update:", nickname);

      const response = await fetch("/api/nickname", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);

        const errorData = JSON.parse(errorText); // JSON으로 변환
        setMessage(
          `Error: ${errorData.detail || "Failed to update nickname."}`
        );
        return;
      }

      const data = await response.json();
      console.log("Success response data:", data);
      setMessage(`Success: ${data.message}`);
    } catch (error) {
      console.error("Error updating nickname:", error);
      setMessage("알 수 없는 서버 에러입니다.");
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
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
