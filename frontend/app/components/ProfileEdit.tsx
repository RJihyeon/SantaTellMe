"use client"
// components/EditProfileForm.tsx

import React, { useState } from 'react';

const ProfileEdit: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [visibility, setVisibility] = useState('public');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Nickname:', nickname);
    console.log('Visibility:', visibility);
    // Handle form submission logic here
  };

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-200 p-4 rounded-lg w-full">
        <div className="mb-4">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="visibility">Visibility:</label>
          <select
            id="visibility"
            name="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            required
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>
        <div className="w-full">
          <div className="mx-auto">
            <button className="bg-red-400" type="submit">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
