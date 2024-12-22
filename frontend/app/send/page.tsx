"use client"
// pages/index.js

import React from 'react';
import SectionUpload from '../components/send/SectionUpload';
import ChevronBg from '../components/chevronBg';
import TitleDivider from '../components/common/TitleDivider';
import SectionSendTo from '../components/send/SectionSend';
import SectionWaitingRoom from '../components/send/SectionWaitingRoom';

const Home = () => {
  return (
    <>
      <ChevronBg />
      <TitleDivider title="Step 1: Create an encoded message!" />
      <SectionUpload />
      <TitleDivider title="Step 2: Select recipient" />
      <SectionSendTo />
      <TitleDivider title="Step 3: Await a response~" />
      <SectionWaitingRoom />
    </>
  );
};

export default Home;