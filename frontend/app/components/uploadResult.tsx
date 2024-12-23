import React, { useState, useEffect } from "react";
import AudioPlayer from "../components/common/AudioPlayer";

interface UploadResultProps {
  isDownloaded: boolean;
  audioId: string | null;  // Use ID instead of audioSrc directly
}

const UploadResult: React.FC<UploadResultProps> = ({ isDownloaded, audioId }) => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      if (audioId) {
        console.log("Fetching audio file... id: " + audioId);
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/voice/${audioId}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch audio file.");
          }

          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          setAudioSrc(audioUrl);
        } catch (err) {
          console.error("Error fetching audio:", err);
          setError("Failed to load audio.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAudio();

    // Cleanup previous blob URLs to avoid memory leaks
    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioId]);  // Trigger fetch when audioId changes

  return (
    <div className="flex flex-col items-center">
      <h3>{isDownloaded ? "Downloaded!" : "Awaiting upload..."}</h3>
      {loading && <p>Loading audio...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {isDownloaded && audioSrc ? (
        <AudioPlayer src={audioSrc} />
      ) : (
        <p className="text-gray-500">Santa is waiting...</p>
      )}
    </div>
  );
};

export default UploadResult;