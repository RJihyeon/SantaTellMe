// components/SectionUpload.tsx

import React, { Suspense, useState } from "react";
import Upload from "../upload";
import UploadResult from "../uploadResult";

const SectionUpload: React.FC = () => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const handleUpload = (id: string) => {
    setAudioSrc(id);
    setIsDownloaded(true);
  };

  const handleStartUpload = () => {
    setIsDownloaded(false);
  };

  return (
    <section>
      <div className="flex items-center justify-center flex-col md:flex-row">
        <div className="w-full h-full px-4 my-4 bg-slate-400 rounded-l-lg">
          <div className="px-2 my-2 flex flex-col gap-2 items-center">
            <h2 className="hidden">Send</h2>
            <h3>Upload or record audio</h3>
            <Suspense fallback={<div>Loading...</div>}>
              <Upload
                initialMessage="Upload a text file"
                startUpload={handleStartUpload}
                onUpload={handleUpload}
              />
            </Suspense>
          </div>
        </div>
        <div className="w-2 h-full bg-slate-600 hidden md:block"></div>
        <div className="w-full h-full bg-red-200 rounded-r-lg">
          <div className="px-2 my-2 flex flex-col gap-2 items-center">
            <h2 className="hidden">Result</h2>
            <UploadResult isDownloaded={isDownloaded} audioId={audioSrc} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionUpload;
