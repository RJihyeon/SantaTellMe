import { JSX } from "preact";
import Profile from "../../components/profile/profile-desc.tsx"


import { PageProps } from "$fresh/server.ts";

export default function ProfilePage(props: PageProps) {
    return (
    <div>
        <div className={"max-w-[1300px] mx-auto mt-[200px]"}>
            <div className={"my-2"}>
                <Profile/>
            </div>
        </div>
    </div>
    );
}