// components/UploadResult.tsx

import React from "react";
import AudioPlayer from "../components/common/AudioPlayer"; // Adjust the path as necessary

interface UploadResultProps {
  isDownloaded: boolean;
  audioSrc: string | null;
}

const UploadResult: React.FC<UploadResultProps> = ({ isDownloaded, audioSrc }) => {
  return (
    <>
      <h3>{isDownloaded ? "Downloaded!" : "Awaiting upload..."}</h3>
      {isDownloaded && audioSrc ? (
        <AudioPlayer src={audioSrc} />
      ) : (
        <p>Santa is waiting...</p>
      )}
    </>
  );
};

export default UploadResult;
