"use client";

import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";

interface UploadProps {
  initialMessage?: string;
  startUpload: () => void;
  onUpload: (id: string) => void;
}

const Upload: React.FC<UploadProps> = ({
  initialMessage,
  startUpload,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [message, setMessage] = useState(initialMessage || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const validTypes = ["audio/wav", "audio/mpeg", "audio/webm"];  // Supported types
  
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
      setMessage("File ready to upload");
    } else {
      setMessage("Please select a valid WAV, MP3, or WEBM file.");
      e.target.value = "";  // Reset file input if invalid
    }
  };

  // Handle Upload (Recordings or File)
  const handleUpload = async () => {
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      alert("No file or recording available.");
      setLoading(false);
      return;
    }

    try {
      startUpload();

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
    setLoading(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      setLoading(false);
      return;
    }

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
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setFile(new File([audioBlob], "recording.webm", { type: "audio/webm" }));
        audioChunks.current = [];
        setMessage("Recording ready for upload.");
        setLoading(false);
      };

      mediaRecorder.start();
      setRecording(true);
      setMessage("Recording...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied. Please allow microphone permissions.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setLoading(false);
      setMessage("Recording stopped.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 min-h-48">
      <div className="flex flex-row items-center gap-2">
        <input
          type="file"
          name="my-file"
          accept="audio/*"
          onChange={handleFileChange}
          className="w-[35vw]"
        />
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 px-4 py-2 w-44 text-white rounded-full"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 px-4 py-2 w-40 text-white rounded-full"
          >
            ⏹️ Stop Recording
          </button>
        )}
        {/* Unified Upload Button */}
        <button
          onClick={handleUpload}
          className={`bg-blue-500 px-6 py-2 text-white rounded-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {/* {message && <p>{message}</p>} */}
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <audio controls src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}

      {message}
    </div>
  );
};

export default Upload;
