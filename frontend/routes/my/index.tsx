import { JSX } from "preact";
import Profile from "../../components/profile/profile-desc.tsx"


import { PageProps } from "$fresh/server.ts";
import SectionProfile from "../../components/profile/SectionProfile.tsx";
import SectionInbox from "../../components/profile/SectionInbox.tsx";
import ChevronBg from "../../components/chevronBg.tsx";
import TitleDivider from "../../components/common/TitleDivider.tsx";

export default function ProfilePage(props: PageProps) {
    return (
    <>
        <ChevronBg />
        <TitleDivider title="My Profile" />
        <SectionProfile />
        <TitleDivider title="Inbox" />
        <SectionInbox />
        <section className={"mb-[200px]"}></section>
    </>
    );
}
