// components/ProfileHighlight.js

import React from 'react';

const ProfileHighlight = () => {
  return (
    <>
      <h3 className="hidden">My Profile</h3>
      <div className="flex flex-row flex-wrap gap-2 bg-red-400 rounded-lg p-4">
        <div className="w-full">
          <div className="flex flex-row gap-2 my-2 text-white">
            <div>
              <a href="https://kakao.com/johndoe">
                <span>Kakao Profile</span>
              </a>
            </div>
            <div>
              <span>Total guesses: 0</span>
            </div>
            <div>
              <span>Correct %: 100%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHighlight;