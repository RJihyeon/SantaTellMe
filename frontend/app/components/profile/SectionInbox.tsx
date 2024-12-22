// components/SectionInbox.tsx

import React from 'react';
import Inbox from '../Inbox';

const SectionInbox: React.FC = () => {
  return (
    <section>
      <div className="wrapper">
        <Inbox />
      </div>
    </section>
  );
};

export default SectionInbox;