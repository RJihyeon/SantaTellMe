"use client";

import React, { useEffect, useState } from "react";

const ProfileHighlight = () => {
  const [inboxCount, setInboxCount] = useState<number>(0); // Inbox 개수 상태
  const [sentCount, setSentCount] = useState<number>(0); // Sent 개수 상태
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInboxCount = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/inbox", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch inbox data.");
          return;
        }

        const data = await response.json();

        // Inbox 데이터에서 'received' 메시지 수를 상태에 저장
        const receivedCount = data.received ? data.received.length : 0;
        setInboxCount(receivedCount);

        const sentCount = data.sent ? data.sent.length : 0;
        setSentCount(sentCount);
      } catch (err) {
        console.error("Error fetching inbox data:", err);
        setError("Error fetching inbox data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInboxCount();
  }, []);

  return (
    <>
      <h3 className="hidden">My Profile</h3>
      <div className="flex flex-row flex-wrap gap-2 bg-red-400 rounded-lg p-4">
        <div className="w-full">
          <div className="flex flex-row gap-2 my-2 text-white">
            <div>
              {/* Inbox 개수 표시 */}
              {loading ? (
                <span>Loading inbox count...</span>
              ) : error ? (
                <span>Error: {error}</span>
              ) : (
                <span>
                  Received Messages: {inboxCount} <br /> Sent Messages:{" "}
                  {sentCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHighlight;
