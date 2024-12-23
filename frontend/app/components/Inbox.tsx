"use client";

import React, { useEffect, useState } from "react";
import Guess from "./Guess";

const Inbox: React.FC = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const handleGuessUpdate = (id: number, fromUser: string) => {
    console.log("[DEBUG] Updating state for ID:", id, "with fromUser:", fromUser);
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
    setShowModal(false);  // Close modal after guess
  };

  const openModal = (id: number) => {
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Received Messages</h1>
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
                {!recording.annonymous
                  ? recording.from_user_name
                  : "Anonymous"}
              </p>
              <p className="text-gray-600">
                <strong>Received At:</strong> {recording.created_at}
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => openModal(recording.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  Guess
                </button>
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
            <h2 className="text-xl font-semibold mb-4 text-center">Guess the Sender</h2>
            {selectedId && (
              <Guess
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