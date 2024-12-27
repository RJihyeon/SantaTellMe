// components/SectionProfile.tsx

import React from 'react';
import ProfileHighlight from './profile-desc'; // Adjust the path as necessary
import ProfileBadge from './ProfileBadge';
import ProfileEdit from '../ProfileEdit';

const SectionProfile: React.FC = () => {
  return (
    <section>
      <div className="wrapper h-[350px]">
        <ProfileBadge />
        <div className="flex flex-col gap-4 w-full mr-4">
          <ProfileHighlight />
          <ProfileEdit />
        </div>
      </div>
    </section>
  );
};

export default SectionProfile;