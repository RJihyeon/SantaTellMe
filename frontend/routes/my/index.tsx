import { h } from "preact";
import Profile from "../../components/profile/profile-desc.tsx"


import { PageProps } from "$fresh/server.ts";

export default function ProfilePage(props: PageProps) {
    return (
    <div>
        <div className={" mt-[200px]"}>
            <div className={"my-2"}>
                <Profile avatarUrl="" name="" bio=""/>
            </div>
        </div>
    </div>
    );
}