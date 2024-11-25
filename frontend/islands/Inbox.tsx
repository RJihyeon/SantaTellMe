import { JSX } from "preact";
import { useState } from "preact/hooks";

interface Recording {
  id: number;
  sender: string;
  receiveTime: string;
  guessed: boolean;
}

export default function Inbox() {
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: 1, sender: "Alice", receiveTime: "2024-11-25 10:00", guessed: false },
    { id: 2, sender: "Bob", receiveTime: "2024-11-25 11:00", guessed: true },
    // Add more recordings as needed
  ]);

  const handleGuess = (id: number) => {
    console.log(`Guessing for recording ID: ${id}`);
    // Implement guess logic here
  };

  const handleShowResult = (id: number) => {
    console.log(`Showing result for recording ID: ${id}`);
    // Implement show result logic here
  };

  return (
    <div className={"w-full mx-4"}>
      <h3 className={"hidden"}>Inbox</h3>
      <div className={"bg-slate-200 rounded-lg p-4"}>
        {recordings.map((recording, index) => (
          <>
            <article
              key={recording.id}
              className={
                "flex flex-row justify-between gap-2 items-center w-full"
              }
            >
              <span>
                <strong>Sender:</strong> {recording.sender}
              </span>
              <span>
                <strong>Receive Time:</strong> {recording.receiveTime}
              </span>
              <span>
                <strong>Guessed:</strong> {String(recording.guessed)}
              </span>
              <div className={"min-w-[20vw] flex flex-row justify-end"}>
                {recording.guessed && (
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
              <hr className={"border-1 border-slate-700"} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
