// components/UploadResult.tsx

import React from "react";
import AudioPlayer from "../components/common/AudioPlayer"; // Adjust the path as necessary

const UploadResult: React.FC = () => {
  const isDownloaded = false;

  return (
    <>
      <h3>{isDownloaded ? "Awaiting upload..." : "Downloaded!"}</h3>
      {isDownloaded ? (
        <p>NO FILE</p>
      ) : (
        <AudioPlayer src="https://example.com/path/to/audio/file.mp3" />
      )}
    </>
  );
};

export default UploadResult;
