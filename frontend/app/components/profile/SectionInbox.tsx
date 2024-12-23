// components/SectionInbox.tsx

import React from "react";
import Inbox from "../Inbox";
import SentInbox from "../SentInbox";

const SectionInbox: React.FC = () => {
  return (
    <section>
      <div className="wrapper">
        <Inbox />
        <SentInbox />
      </div>
    </section>
  );
};

export default SectionInbox;
