// components/Header.js

import React from 'react';
import ChevronPattern from './chevron';

const Header = () => {
  return (
    <header>
      <div className="w-full mx-auto text-white relative">
        <div className="bg-slate-900">
          <div className="wrapper flex flex-row justify-between mx-auto">
            <div className="m-4">
            <a className='hover:no-underline' href="/"><h2>Santa Tell Me</h2></a>
            </div>
            <div className="m-4">
              <ul style={styles.navList} className="h-full flex flex-row gap-4 lg:gap-6 items-center">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/invite">Invite</a>
                </li>
                <li>
                  <a href="/my">Profile</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="absolute w-full z-30">
          <ChevronPattern forecolor="#0F172A" />
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#0F172A',
    color: 'white',
    textAlign: 'center',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
  },
};

export default Header;