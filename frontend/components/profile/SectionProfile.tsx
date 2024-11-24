// src/profile/SectionProfile.tsx
import { JSX } from "preact";
import Profile from "./profile-desc.tsx";

const SectionProfile = () => {
    return (
        <section>
            <div className={"wrapper"}>
                <div>
                    <Profile />
                </div>
            </div>
        </section>
    );
};

export default SectionProfile;
          
          