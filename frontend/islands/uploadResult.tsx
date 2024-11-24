import { Handlers } from "$fresh/server.ts";
import AudioPlayer from "../components/common/AudioPlayer.tsx";

export default function UploadResult() {
  const isDownloaded = false;

  return (
    <>
      <h3>{isDownloaded ? <>Awaiting upload...</> : <>Downloaded!</>}</h3>
      {isDownloaded ? (
        <p>NO FILE</p>
      ) : (
        <AudioPlayer src="https://example.com/path/to/audio/file.mp3" />
      )}
    </>
  );
}
