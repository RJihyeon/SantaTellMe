"use client"
// pages/index.js

import React from 'react';
import ChevronBg from '../components/chevronBg';
import TitleDivider from '../components/common/TitleDivider';
import SectionShareLink from '../components/invite/SectionShareLink';
import SectionReceiveLink from '../components/invite/SectionReceiveLink';

const Home = () => {
  return (
    <>
      <ChevronBg />
      <TitleDivider title="Share your link!" />
      <SectionShareLink />
      <TitleDivider title="Paste invite link" />
      <SectionReceiveLink />
    </>
  );
};

export default Home;