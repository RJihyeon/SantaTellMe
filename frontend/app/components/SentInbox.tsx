"use client";

import React, { useEffect, useState } from "react";

const SentInbox: React.FC = () => {
  const [sentMessages, setSentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentMessages = async () => {
      setLoading(true);
      setMessage(null);

      try {
        const response = await fetch("/api/inbox", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to fetch sent messages.");
          return;
        }

        const data = await response.json();
        console.log("Data received from API:", data);

        // 'sent' 데이터를 상태에 저장
        setSentMessages(data.sent || []);
      } catch (error) {
        console.error("Error fetching sent messages:", error);
        setMessage("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentMessages();
  }, []);

  const handlePlayAudio = async (id: string) => {
    console.log(`Playing audio for voice ID: ${id}`);

    try {
      const response = await fetch(`/api/voice/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  if (loading) {
    return <p>Loading sent messages...</p>;
  }

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <div className="w-[40vw] mx-auto p-4">
      <h3 className="hidden text-2xl font-bold mb-6 text-center">
        Sent Messages
      </h3>
      {sentMessages.length === 0 ? (
        <p className="text-gray-500 text-center">No sent messages found.</p>
      ) : (
        <div className="space-y-4">
          {sentMessages.map((message) => (
            <div
              key={message.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-semibold text-black">
                <strong>To:</strong> {message.to_user_name}
              </p>
              <p className="text-gray-600">
                {new Date(message.created_at + 'Z').toLocaleString("en-US", {
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> {message.is_read ? "Read" : "Unread"}
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handlePlayAudio(message.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Play Audio
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentInbox;
