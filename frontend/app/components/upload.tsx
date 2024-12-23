"use client";

import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";

interface UploadProps {
  initialMessage?: string;
  onUpload: (id: string) => void;
}

const Upload: React.FC<UploadProps> = ({ initialMessage, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [message, setMessage] = useState(initialMessage || "");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type === "audio/wav" || selectedFile.type === "audio/mpeg")) {
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
      setMessage("File ready to upload");
    } else {
      setMessage("Please select a valid WAV or MP3 file.");
    }
  };

  // Handle Upload (Recordings or File)
  const handleUpload = async () => {
    setLoading(true); // Show loading state

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      alert("No file or recording available.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/upload?token=" + token, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("File uploaded successfully!");
        onUpload(data.id);
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setFile(new File([audioBlob], "recording.wav", { type: "audio/wav" }));
        audioChunks.current = [];
        setMessage("Recording ready for upload.");
      };

      mediaRecorder.start();
      setRecording(true);
      setMessage("Recording...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to record audio.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setMessage("Recording stopped.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-semibold">Upload or Record Audio</h1>
      
      {/* File Upload */}
      <div className="flex flex-row items-center gap-4">
        <input
          type="file"
          name="my-file"
          accept=".wav, .mp3"
          onChange={handleFileChange}
        />
      </div>

      {/* Record Button */}
      <div className="mt-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 px-4 py-2 text-white rounded"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 px-4 py-2 text-white rounded"
          >
            ⏹️ Stop Recording
          </button>
        )}
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <audio controls src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Unified Upload Button */}
      <button
        onClick={handleUpload}
        className={`bg-blue-500 px-6 py-2 text-white rounded mt-6 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Upload;