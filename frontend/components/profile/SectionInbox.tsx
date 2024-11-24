// src/profile/SectionInbox.tsx
import { JSX } from "preact";
import Inbox from "./Inbox.tsx";

const SectionInbox = () => {
    return (
        <section>
            <div className={"wrapper"}>
                <div>
                    <Inbox />
                </div>
            </div>
        </section>
    );
};

export default SectionInbox;
          
          