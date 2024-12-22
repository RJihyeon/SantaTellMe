"use client";

import React, { useEffect, useState } from "react";

const Inbox: React.FC = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMessage(null);

      try {
        console.log("Fetching inbox data from /api/inbox...");
        const response = await fetch("/api/inbox", {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching data:", errorData);
          setMessage(errorData.message || "Failed to fetch data");
          return;
        }

        const data = await response.json();
        console.log("Data received:", data);

        // 받은 데이터가 비어 있으면 메시지 표시
        if (!data.received || data.received.length === 0) {
          setMessage("메일함이 비었습니다.");
          setRecordings([]);
          return;
        }

        setRecordings(data.received); // 받은 메일 데이터를 상태에 저장
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 오디오 재생 함수
  const handlePlayAudio = (s3_id: string) => {
    console.log(`Playing audio for S3 ID: ${s3_id}`);
    const audioUrl = `https://s3.amazonaws.com/your-bucket-name/${s3_id}`;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  // 맞히기 버튼 클릭 시 처리
  const handleGuess = (id: number) => {
    console.log(`Guessing for recording ID: ${id}`);
    setRecordings((prev) =>
      prev.map((recording) =>
        recording.id === id ? { ...recording, guessed: true } : recording
      )
    );
  };

  if (loading) return <p>Loading...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">받은 메일함</h1>
      {recordings.length === 0 ? (
        <p className="text-gray-500 text-center">메일함이 비어 있습니다.</p>
      ) : (
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-semibold">
                <strong>Sender:</strong> {recording.from_user}
              </p>
              <p className="text-gray-600">
                <strong>Received At:</strong> {recording.created_at}
              </p>
              <div className="flex gap-4 mt-4">
                {/* 오디오 재생 버튼 */}
                <button
                  onClick={() => handlePlayAudio(recording.s3_id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Play Audio
                </button>

                {/* 맞히기 버튼 */}
                {!recording.guessed && (
                  <button
                    onClick={() => handleGuess(recording.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    Guess
                  </button>
                )}
                {recording.guessed && (
                  <span className="text-green-600 font-bold">
                    Already Guessed!
                  </span>
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
