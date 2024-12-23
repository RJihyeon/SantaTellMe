"use client";

import React, { useState } from "react";

interface GuessProps {
  id: number;
  onGuessSuccess: (id: number, sender: string) => void;
  onError?: (message: string) => void;
}

const Guess: React.FC<GuessProps> = ({ id, onGuessSuccess, onError }) => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGuess = async () => {
    if (!username.trim()) {
      alert("Please enter a valid username.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/guess?voice_id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ guessed_from_username: username }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.detail || "Failed to guess sender.";
        setErrorMessage(message);
        onError?.(message);
        return;
      }

      // Correct guess일 때만 상태 업데이트
      if (data.message === "Correct guess!") {
        alert(data.message);
        onGuessSuccess(id, username); // 클라이언트 입력값을 그대로 sender로 전달
      } else {
        setErrorMessage("Incorrect guess. Try again.");
      }
    } catch (error) {
      console.error("Error during guess:", error);
      const message = "An error occurred while guessing the sender.";
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border px-2 py-1 rounded-lg text-sm"
      />
      <button
        onClick={handleGuess}
        disabled={loading}
        className={`px-4 py-2 text-white rounded-lg text-sm ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 transition-colors"
        }`}
      >
        {loading ? "Checking..." : "Guess"}
      </button>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default Guess;
