// pages/profile.js

import React from 'react';
import Profile from '../components/profile/profile-desc';
import SectionProfile from '../components/profile/SectionProfile';
import SectionInbox from '../components/profile/SectionInbox';
import ChevronBg from '../components/chevronBg';
import TitleDivider from '../components/common/TitleDivider';

const ProfilePage = () => {
  return (
    <>
      <ChevronBg />
      <TitleDivider title="My Profile" />
      <SectionProfile />
      <TitleDivider title="Inbox" />
      <SectionInbox />
      <section className="mb-[200px]"></section>
    </>
  );
};

export default ProfilePage;
