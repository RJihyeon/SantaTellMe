// src/profile/SectionInbox.tsx
import { JSX } from "preact";
import Inbox from "../../islands/Inbox.tsx";

const SectionInbox = () => {
  return (
    <section>
      <div className={"wrapper"}>
        <Inbox />
      </div>
    </section>
  );
};

export default SectionInbox;
