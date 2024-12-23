"use client";

import React, { useEffect, useState } from "react";
import Guess from "./Guess";

const Inbox: React.FC = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage(null);

      try {
        console.log("[DEBUG] Fetching inbox data from /api/inbox...");
        const response = await fetch("/api/inbox", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("[DEBUG] Fetch failed:", errorData);
          setMessage(errorData.message || "Failed to fetch data");
          return;
        }

        const data = await response.json();
        console.log("[DEBUG] Data received from API:", data);

        setRecordings(data.received); // Store received data in state
        console.log("[DEBUG] Updated recordings state:", data.received);
      } catch (error) {
        console.error("[DEBUG] Fetch error:", error);
        setMessage("Error fetching data.");
      } finally {
        setLoading(false);
        console.log("[DEBUG] Finished fetching. Loading state:", loading);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("[DEBUG] Recordings state updated:", recordings);
  }, [recordings]);

  // 오디오 재생 함수
  const handlePlayAudio = (s3_id: string) => {
    console.log(`[DEBUG] Playing audio for S3 ID: ${s3_id}`);
    const audioUrl = `https://s3.amazonaws.com/your-bucket-name/${s3_id}`;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleGuessUpdate = (id: number, fromUser: string) => {
    console.log(
      "[DEBUG] Updating state for ID:",
      id,
      "with fromUser:",
      fromUser
    );
    setRecordings((prevRecordings) =>
      prevRecordings.map((recording) =>
        recording.id === id
          ? {
              ...recording,
              is_correct: true,
              from_user_name: fromUser,
              annonymous: false,
            }
          : recording
      )
    );
  };

  if (loading) {
    console.log("[DEBUG] Currently loading...");
    return <p>Loading...</p>;
  }

  if (message) {
    console.log("[DEBUG] Message state set:", message);
    return <p>{message}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Received Messages</h1>
      {recordings.length === 0 ? (
        <p className="text-gray-500 text-center">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {recordings.map((recording, index) => (
            <div
              key={recording.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-semibold text-black">
                <strong>Sender:</strong>{" "}
                {!recording.annonymous
                  ? recording.from_user_name
                  : "annonymous"}
              </p>
              <p className="text-gray-600">
                <strong>Received At:</strong> {recording.created_at}
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handlePlayAudio(recording.s3_id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Play Audio
                </button>
                {/* Guess 컴포넌트 */}
                {recording.annonymous && !recording.is_correct && (
                  <Guess id={recording.id} onGuessSuccess={handleGuessUpdate} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;
