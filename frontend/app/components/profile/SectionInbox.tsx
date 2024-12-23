// components/SectionInbox.tsx

import React from "react";
import Inbox from "../Inbox";
import SentInbox from "../SentInbox";

const SectionInbox: React.FC = () => {
  return (
    <section>
      <div className="wrapper h-[100vh] overflow-y-scroll">
        <Inbox />
        <SentInbox />
      </div>
    </section>
  );
};

export default SectionInbox;
