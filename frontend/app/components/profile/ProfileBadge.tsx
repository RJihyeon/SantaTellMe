// components/ProfileBadge.js

import React from 'react';

const ProfileBadge = () => {
  return (
    <div className="mx-4 h-full">
      <h3 className="hidden">Profile badge</h3>
      <div className="p-4 bg-gradient-to-br from-red-400 to-slate-200 rounded-lg lg:w-[40vh] h-full">
        <div className="w-[150px]">
          <img
            src="https://placehold.co/150x150"
            alt="Avatar"
            className="rounded-full border-spacing-2 border-white border-4 w-[150px]"
          />
        </div>
        <div className="flex flex-col place-content-between p-4">
          <span>
            <strong>Name:</strong> John Doe
          </span>
          <span>
            <strong>Nickname:</strong> Johnny
          </span>
          <span>
            <strong>Email:</strong> johndoe@example.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;