"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface UploadProps {
  initialMessage?: string;
  onUpload: (fileUrl: string) => void;
}

const Upload: React.FC<UploadProps> = ({ initialMessage, onUpload }) => {
  const [message, setMessage] = useState(initialMessage || "");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log(file.name);

    try {
      const response = await fetch("/api/upload?token=" + token, {
        method: "POST",
        body: formData,
        credentials: "include", // Ensure cookies are sent
      });

      if (response.ok) {
        alert("File uploaded successfully");
        //onUpload(); TODO get file url from backend
      } else {
        const error = await response.json();
        alert(`Failed to upload file: ${error.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again later.");
    }
  };

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior

    const form = event.currentTarget;
    const input = form.elements.namedItem("my-file") as HTMLInputElement;

    const file = input.files?.[0];
    if (!file) {
      setMessage("No file selected!");
      return;
    }

    try {
      await handleUpload(file); // Pass the file to handleUpload
      setMessage("File uploaded successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("An unknown error occurred!");
      }
    }
  }

  return (
    <>
      <form
        method="post"
        encType="multipart/form-data"
        className="flex flex-row gap-2 items-center"
        onSubmit={handleFormSubmit} // Add form submit event handler
      >
        <div>
          <input type="file" name="my-file" accept=".mp3" />
        </div>
        <div>
          <button className="bg-red-400" type="submit">
            Upload
          </button>
        </div>
      </form>
      {message ? <p>{message}</p> : null}
    </>
  );
};

export default Upload;
