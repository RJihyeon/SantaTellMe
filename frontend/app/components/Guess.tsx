"use client";

import React, { useState } from "react";

interface GuessProps {
  id: string;
  onGuessSuccess: (id: string, sender: string) => void;
  onError?: (message: string) => void;
  hint: string;
}

const Guess: React.FC<GuessProps> = ({ id, onGuessSuccess, onError, hint }) => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const makeGuessRequest = async (id: string, username: string) => {
    const response = await fetch(`/api/guess?voice_id=${id}`, {
      method: "POST",
      body: JSON.stringify({ guessed_from_username: username }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to guess sender.");
    return data;
  };

  const handleGuess = async () => {
    if (!username.trim()) {
      alert("Please enter a valid username.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await makeGuessRequest(id, username);

      if (data.message === "Correct guess!") {
        alert("You guessed correctly!");
        onGuessSuccess(id, username);
      } else {
        setErrorMessage("That guess is incorrect. Try again.");
      }
    } catch (error: any) {
      console.error("Error during guess:", error.message);
      setErrorMessage(error.message);
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (id: string) => {
    console.log(`Playing audio for voice ID: ${id}`);

    try {
      const response = await fetch(`/api/voice/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio file.");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("Error fetching audio:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-500 text-sm">
        <strong>Hint:</strong> {hint}
      </p>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={`border px-2 py-1 rounded-lg text-sm ${
          loading ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      />

      <div className="flex flex-row gap-2">
        <button
          onClick={() => handlePlayAudio(id)}
          className="px-4 py-2 w-1/2 text-white bg-blue-500 rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          Play Audio
        </button>
        <button
          onClick={() => handleGuess()}
          disabled={loading}
          className={`px-4 py-2 w-full text-white rounded-lg text-sm ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 transition-colors"
          }`}
        >
          {loading ? "Checking..." : "Guess"}
        </button>
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default Guess;
