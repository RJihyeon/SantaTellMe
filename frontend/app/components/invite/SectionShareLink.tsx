"use client";

import React, { useState, useEffect, useRef } from "react";

const SectionShareLink: React.FC = () => {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);
  const linkRef = useRef<HTMLDivElement | null>(null);

  // Automatically fetch the invite link when the component loads
  useEffect(() => {
    const fetchInviteLink = async () => {
      try {
        const response = await fetch("/api/invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInviteLink(data.url);
        } else {
          setError("Failed to generate invite link.");
        }
      } catch (err) {
        console.error("Error fetching link:", err);
        setError("An error occurred.");
      }
    };

    fetchInviteLink();
  }, []);

  // Copy to clipboard logic
  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset "copied" after 2s
        })
        .catch(() => {
          setError("Failed to copy link.");
        });
    }
  };

  return (
    <section>
      <div className="wrapper">
        <div className="h-72 w-full py-4 bg-red-400 rounded-lg mx-auto flex flex-col text-center">
          <div className="h-10">
            <h3 className="text-lg mb-4 hidden">Your link is:</h3>
          </div>

          {inviteLink ? (
            <>
              <img
                src="/share/gift-box.png"
                alt="Gift Box"
                className="w-32 h-32 animate-bounce self-center"
              />
              <div
                ref={linkRef}
                className="flex flex-col items-center justify-center p-4 rounded border w-[95%] mt-4 cursor-pointer self-center whitespace-nowrap bg-white overflow-hidden"
                onClick={handleCopyLink}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <p className="text-gray-500 text-center">
                  {isHovered ? "Click to copy to clipboard" : inviteLink}
                </p>
              </div>
              <p className="text-white min-h-7">
                {copied && "Link copied to clipboard!"}
              </p>
            </>
          ) : (
            <p>Generating invite link...</p>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default SectionShareLink;
