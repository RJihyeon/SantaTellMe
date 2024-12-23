'use client';

import React, { useState, useEffect, useRef } from 'react';

const SectionShareLink: React.FC = () => {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const linkRef = useRef<HTMLDivElement | null>(null);

  // Automatically fetch the invite link when the component loads
  useEffect(() => {
    const fetchInviteLink = async () => {
      try {
        const response = await fetch('/api/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInviteLink(data.url);
        } else {
          setError('Failed to generate invite link.');
        }
      } catch (err) {
        console.error('Error fetching link:', err);
        setError('An error occurred.');
      }
    };

    fetchInviteLink();
  }, []);

  // Copy to clipboard logic
  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);  // Reset "copied" after 2s
        })
        .catch(() => {
          setError('Failed to copy link.');
        });
    }
  };

  return (
    <section>
      <div className="wrapper">
        <div className="h-56 w-full py-4 bg-red-400 rounded-lg mx-auto flex flex-col text-center">
          <h3 className="text-lg mb-4">Your link is:</h3>
          
          {inviteLink ? (
            <div
              ref={linkRef}
              className="p-2 bg-white rounded border w-[90%] cursor-pointer self-center overflow-hidden"
              onClick={handleCopyLink}
            >
              {inviteLink}
            </div>
          ) : (
            <p>Generating invite link...</p>
          )}

          {copied && (
            <p className="text-white mt-2">Link copied to clipboard!</p>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default SectionShareLink;