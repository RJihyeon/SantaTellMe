'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SectionReceiveLink: React.FC = () => {
  const [link, setLink] = useState<string>('');
  const router = useRouter();

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData('text');
    setLink(pastedText);

    // Extract parameter from the pasted link (optional parsing logic)
    const inviteParam = new URL(pastedText).searchParams.get('invite') || pastedText;

    // Navigate to /send with the parameter
    router.push(`/send?invite=${encodeURIComponent(inviteParam)}`);
  };

  return (
    <section>
      <div className="wrapper">
        <div className="h-72 bg-red-200 rounded-lg p-4 mx-auto flex flex-col items-center justify-center">
          <h3 className="text-lg mb-4">Paste link here:</h3>
          <input
            type="text"
            className="p-2 border rounded w-3/4"
            value={link}
            onPaste={handlePaste}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste invite link..."
          />
        </div>
      </div>
    </section>
  );
};

export default SectionReceiveLink;