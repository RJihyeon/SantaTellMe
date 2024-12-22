// components/AudioPlayer.tsx

import React, { useRef } from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={src} />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
};

export default AudioPlayer;