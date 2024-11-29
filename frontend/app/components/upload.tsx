// components/Upload.tsx

import React, { useState } from 'react';
import { uploadFile } from '../api/upload';

interface UploadProps {
  initialMessage?: string;
}

const Upload: React.FC<UploadProps> = ({ initialMessage }) => {
  const [message, setMessage] = useState(initialMessage || '');

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior

    const form = event.currentTarget;
    const input = form.elements.namedItem('my-file') as HTMLInputElement;
    console.log('Input element:', input); // Check if input element is correctly retrieved
    const file = input.files?.[0];
    console.log('Selected file:', file); // Check if the selected file is correctly retrieved

    if (!file) {
      setMessage('No file selected!');
      return;
    }

    try {
      const resultMessage = await uploadFile(file);
      setMessage(resultMessage);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred!');
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