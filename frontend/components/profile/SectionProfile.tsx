// src/profile/SectionProfile.tsx
import { JSX } from "preact";
import ProfileHighlight from "./profile-desc.tsx";
import ProfileBadge from "./ProfileBadge.tsx";
import ProfileEdit from "../../islands/ProfileEdit.tsx";

const SectionProfile = () => {
  return (
    <section>
      <div className={"wrapper h-[350px]"}>
        <ProfileBadge />
        <div className={"flex flex-col gap-4 w-full mr-4"}>
          <ProfileHighlight />
          <ProfileEdit />
        </div>
      </div>
    </section>
  );
};

export default SectionProfile;
