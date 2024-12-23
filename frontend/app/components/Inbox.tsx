"use client";

import React, { useEffect, useState } from "react";
import Guess from "./Guess";

const Inbox: React.FC = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage(null);

      try {
        console.log("[DEBUG] Fetching inbox data from /api/inbox...");
        const response = await fetch("/api/inbox", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("[DEBUG] Fetch failed:", errorData);
          setMessage(errorData.message || "Failed to fetch data");
          return;
        }

        const data = await response.json();
        console.log("[DEBUG] Data received from API:", data);
        setRecordings(data.received);
      } catch (error) {
        console.error("[DEBUG] Fetch error:", error);
        setMessage("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleGuessUpdate = (id: string, fromUser: string) => {
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
    setShowModal(false); // Close modal after guess
  };

  const openModal = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <div className="w-[40vw] mx-auto p-4">
      <h3 className="hidden text-2xl font-bold mb-6 text-center">
        Received Messages
      </h3>
      {recordings.length === 0 ? (
        <p className="text-gray-500 text-center">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-semibold text-black">
                <strong>Sender:</strong>{" "}
                {!recording.annonymous ? recording.from_user_name : "Anonymous"}
              </p>
              <p className="text-gray-600">
                {new Date(recording.created_at + 'Z').toLocaleString("en-US", {
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}
              </p>
              <div className="flex gap-4 mt-4">
                {recording.is_read ? (
                  <button
                  onClick={() => handlePlayAudio(recording.id)}
                  className="px-4 py-2 w-1/2 text-white bg-blue-500 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Play Audio
                </button>
                ) : (
                  <button
                    onClick={() => openModal(recording.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                  >
                    Guess
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup for Guess */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-lg font-semibold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Guess the Sender
            </h2>

            {selectedId && (
              <Guess
                hint={
                  recordings.find((rec) => rec.id === selectedId)
                    ?.from_user_nickname || "No hint available"
                }
                id={selectedId}
                onGuessSuccess={handleGuessUpdate}
                onError={(msg) => console.error(msg)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
