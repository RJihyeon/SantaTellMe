"use client";
// components/Inbox.tsx

import React, { useState } from "react";

interface Recording {
  id: number;
  sender: string;
  receiveTime: string;
  guessed: boolean;
}

const Inbox: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: 1, sender: "Alice", receiveTime: "2024-11-25 10:00", guessed: false },
    { id: 2, sender: "Bob", receiveTime: "2024-11-25 11:00", guessed: true },
    // Add more recordings as needed
  ]);

  const handleGuess = (id: number) => {
    console.log(`Guessing for recording ID: ${id}`);
    setRecordings((prevRecordings) =>
      prevRecordings.map((recording) =>
        recording.id === id ? { ...recording, guessed: true } : recording
      )
    );
  };

  const handleShowResult = (id: number) => {
    console.log(`Showing result for recording ID: ${id}`);
    alert(`Result for recording ID: ${id}`);
  };

  return (
    <div className="w-full mx-4">
      <h3 className="text-xl font-bold mb-4">Inbox</h3>
      <div className="bg-slate-200 rounded-lg p-4 shadow-md">
        {recordings.map((recording, index) => (
          <React.Fragment key={recording.id}>
            <article className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full py-2">
              <div>
                <span className="block">
                  <strong>Sender:</strong> {recording.sender}
                </span>
                <span className="block">
                  <strong>Receive Time:</strong> {recording.receiveTime}
                </span>
              </div>
              <span className="block sm:ml-auto">
                <strong>Guessed:</strong> {recording.guessed ? "Yes" : "No"}
              </span>
              <div className="flex flex-row justify-end gap-2">
                {!recording.guessed && (
                  <button onClick={() => handleGuess(recording.id)}>
                    Guess
                  </button>
                )}
                <button onClick={() => handleShowResult(recording.id)}>
                  Show Result
                </button>
              </div>
            </article>
            {index < recordings.length - 1 && (
              <hr className="border-t border-slate-400 my-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
