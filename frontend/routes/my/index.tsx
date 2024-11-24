import { JSX } from "preact";
import Profile from "../../components/profile/profile-desc.tsx"


import { PageProps } from "$fresh/server.ts";
import SectionProfile from "../../components/profile/SectionProfile.tsx";
import SectionInbox from "../../components/profile/SectionInbox.tsx";

export default function ProfilePage(props: PageProps) {
    return (
    <>
        <SectionProfile />
        <SectionInbox />
    </>
    );
}
